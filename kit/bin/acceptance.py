#!/usr/bin/env python3
"""Hola Egipto acceptance checks (Next.js + Payload). Stdlib only.

Run via `bash kit/bin/acceptance.sh` from anywhere; paths are resolved from this file.
Never prints secrets: values from .env.local are only compared, never echoed.
"""
import datetime
import gzip
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(KIT)
PREFLIGHT = "--preflight" in sys.argv
RESULTS = []  # (status, id, message)
COUNTS = {"PASS": 0, "FAIL": 0, "WARN": 0, "BLOCKED": 0}


def rec(status, cid, msg):
    COUNTS[status] += 1
    RESULTS.append((status, cid, msg))
    print(f"[{status}] {cid} {msg}", flush=True)


def check(cond, cid, ok_msg, fail_msg, fail_status="FAIL"):
    rec("PASS" if cond else fail_status, cid, ok_msg if cond else fail_msg)
    return bool(cond)


# ----------------------------------------------------------------- env file
def read_env(path):
    env = {}
    if not os.path.isfile(path):
        return None
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            v = v.strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            env[k.strip()] = v
    return env


ENV = read_env(os.path.join(ROOT, ".env.local")) or {}
BASE = (os.environ.get("BASE_URL") or ENV.get("NEXT_PUBLIC_SITE_URL") or "http://localhost:3000").rstrip("/")
SITE = (ENV.get("NEXT_PUBLIC_SITE_URL") or BASE).rstrip("/")
PREVIEW_KEY = ENV.get("HOLA_PREVIEW_KEY", "")


# ------------------------------------------------------------------- shell
def run(cmd, timeout=180):
    try:
        p = subprocess.run(cmd, cwd=ROOT, shell=True, capture_output=True, text=True, timeout=timeout)
        return p.returncode, p.stdout, p.stderr
    except subprocess.TimeoutExpired:
        return 124, "", f"timeout after {timeout}s"


def hola(args, timeout=180):
    """Run `pnpm -s hola:<args>`; return (code, stdout)."""
    code, out, err = run(f"pnpm -s hola:{args}", timeout)
    return code, out.strip()


def hola_json(args, timeout=180):
    code, out = hola(args, timeout)
    if code != 0:
        return None
    try:
        return json.loads(out)
    except ValueError:
        pass
    # tolerate log noise before the JSON: take the last line that parses
    for line in reversed(out.splitlines()):
        try:
            return json.loads(line.strip())
        except ValueError:
            continue
    return None


# -------------------------------------------------------------------- http
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


class Resp:
    def __init__(self, status, headers, body, elapsed):
        self.status = status
        self.headers = headers
        self.body = body
        self.elapsed = elapsed

    def h(self, name):
        return self.headers.get(name) if self.headers else None

    def all(self, name):
        return self.headers.get_all(name) if self.headers else []

    @property
    def text(self):
        return self.body.decode("utf-8", errors="replace")


def http(path, method="GET", headers=None, data=None, cookies=None, timeout=60):
    url = path if path.startswith("http") else BASE + path
    hdrs = {"User-Agent": "hola-acceptance/1.0", "Accept-Encoding": "identity"}
    if headers:
        hdrs.update(headers)
    if cookies:
        hdrs["Cookie"] = "; ".join(f"{k}={v}" for k, v in cookies.items())
    body = data
    if isinstance(data, (dict, list)):
        body = json.dumps(data).encode()
        hdrs.setdefault("Content-Type", "application/json")
    elif isinstance(data, str):
        body = data.encode()
    req = urllib.request.Request(url, data=body, method=method, headers=hdrs)
    t0 = time.time()
    try:
        r = OPENER.open(req, timeout=timeout)
        return Resp(r.status, r.headers, r.read(), time.time() - t0)
    except urllib.error.HTTPError as e:
        return Resp(e.code, e.headers, e.read() if e.fp else b"", time.time() - t0)
    except Exception as e:  # connection refused, timeout
        return Resp(0, None, str(e).encode(), time.time() - t0)


def set_cookie_value(resp, name):
    for sc in resp.all("Set-Cookie") or []:
        m = re.match(r"\s*" + re.escape(name) + r"=([^;]*)", sc)
        if m:
            return m.group(1)
    return None


# ------------------------------------------------------------- html parse
class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.h1 = 0
        self.h1_text = []
        self._in_h1 = False
        self.title = ""
        self._in_title = False
        self.metas = []
        self.links = []
        self.imgs = []
        self.anchors = []
        self.scripts = []  # dicts: attrs, text, in_head
        self._script = None
        self.in_head = False
        self.ids = set()
        self.text_parts = []
        self._skip_text = 0

    def handle_starttag(self, tag, attrs):
        a = {k: (v if v is not None else "") for k, v in attrs}
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "head":
            self.in_head = True
        elif tag == "body":
            self.in_head = False
        elif tag == "h1":
            self.h1 += 1
            self._in_h1 = True
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            self.metas.append(a)
        elif tag == "link":
            self.links.append(a)
        elif tag == "img":
            self.imgs.append(a)
        elif tag == "a":
            self.anchors.append(a)
        elif tag == "script":
            self._script = {"attrs": a, "text": "", "in_head": self.in_head}
        if tag in ("script", "style", "noscript", "template"):
            self._skip_text += 1

    def handle_endtag(self, tag):
        if tag == "h1":
            self._in_h1 = False
        elif tag == "title":
            self._in_title = False
        elif tag == "head":
            self.in_head = False
        elif tag == "script" and self._script is not None:
            self.scripts.append(self._script)
            self._script = None
        if tag in ("script", "style", "noscript", "template") and self._skip_text:
            self._skip_text -= 1

    def handle_data(self, data):
        if self._script is not None:
            self._script["text"] += data
            return
        if self._in_title:
            self.title += data
        if self._in_h1:
            self.h1_text.append(data)
        if not self._skip_text:
            self.text_parts.append(data)

    @property
    def visible_text(self):
        return re.sub(r"\s+", " ", " ".join(self.text_parts))

    def meta(self, name):
        for m in self.metas:
            if m.get("name", "").lower() == name:
                return m.get("content", "")
        return None

    def link_rel(self, rel):
        return [l for l in self.links if rel in l.get("rel", "").lower().split()]

    def jsonld(self):
        out, bad = [], 0
        for s in self.scripts:
            if s["attrs"].get("type", "").lower() == "application/ld+json":
                try:
                    out.append(json.loads(s["text"]))
                except ValueError:
                    bad += 1
        return out, bad


def parse(text):
    p = Page()
    try:
        p.feed(text)
    except Exception:
        pass
    return p


def ld_types(objs):
    types = set()

    def walk(o):
        if isinstance(o, dict):
            t = o.get("@type")
            if isinstance(t, str):
                types.add(t)
            elif isinstance(t, list):
                types.update(x for x in t if isinstance(x, str))
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(objs)
    return types


# ============================================================== the checks
STATE = {"server": False, "cookie": None, "schema": None, "urls": []}

PAYLOAD_TRIP_BASES = {"/viajes-a-egipto/": "tour", "/en/egypt-tours/": "tour",
                      "/cruceros-por-el-nilo/": "cruise", "/en/nile-cruises/": "cruise",
                      "/excursiones/": "excursion", "/en/excursions/": "excursion"}
DEST_BASES = ("/destinos/", "/en/destinations/")
GUIDE_BASES = ("/guia-de-viaje/", "/en/travel-guide/")
TERM_SEGMENTS = ("/duracion/", "/duration/", "/estilo/", "/style/", "/tipo/", "/type/",
                 "/desde/", "/from/", "/region/", "/tema/", "/topic/")
FORBIDDEN_CLAIMS = ["cancelación gratuita", "cancelacion gratuita", "free cancellation", "pay on arrival",
                    "pago a la llegada", "pago al llegar", "mejor precio", "best price", "24/7", "tripadvisor"]

REQUIRED_ARCHIVES = ["/", "/en/", "/viajes-a-egipto/", "/en/egypt-tours/", "/cruceros-por-el-nilo/",
                     "/en/nile-cruises/", "/excursiones/", "/en/excursions/", "/destinos/", "/en/destinations/",
                     "/guia-de-viaje/", "/en/travel-guide/"]
REQUIRED_PAGES = ["/planifica-tu-viaje/", "/en/plan-my-trip/", "/gracias/", "/en/thank-you/",
                  "/sobre-nosotros/", "/en/about-us/", "/contacto/", "/en/contact/",
                  "/preguntas-frecuentes/", "/en/faq/", "/aviso-legal/", "/en/legal-notice/",
                  "/politica-de-privacidad/", "/en/privacy-policy/", "/politica-de-cookies/",
                  "/en/cookie-policy/", "/condiciones-y-cancelacion/", "/en/terms-and-cancellation/"]


def a0_environment():
    code, out, _ = run("node -v")
    m = re.match(r"v(\d+)", out.strip())
    check(m and int(m.group(1)) >= 22, "A0", f"node {out.strip()}", f"node ≥ 22 required (found {out.strip() or 'none'})")
    code, out, _ = run("pnpm -v")
    check(code == 0, "A0", f"pnpm {out.strip()}", "pnpm not found")
    check(os.path.isfile(os.path.join(KIT, "START-HERE.md")), "A0", "kit layout (kit/START-HERE.md)",
          "kit/START-HERE.md not found: run from the repository root with the kit in kit/")
    if not os.path.isfile(os.path.join(ROOT, ".env.local")):
        rec("FAIL", "A0", ".env.local missing in the repository root")
    else:
        for k in ("DATABASE_URI", "PAYLOAD_SECRET", "HOLA_PREVIEW_KEY", "NEXT_PUBLIC_SITE_URL"):
            check(ENV.get(k), "A0", f".env.local has {k}", f".env.local: {k} missing or empty")
        check(ENV.get("HOLA_COMING_SOON") == "1", "A0", "HOLA_COMING_SOON=1",
              "HOLA_COMING_SOON must be 1 during the build")
        check(ENV.get("HOLA_DEV_MODE") == "1", "A0", "HOLA_DEV_MODE=1", "HOLA_DEV_MODE must be 1 during the build")
    r = http("/robots.txt", timeout=15)
    STATE["server"] = r.status == 200
    check(STATE["server"], "A0", f"server answers at {BASE}",
          f"server not reachable at {BASE} (start it with `pnpm build && pnpm start`); HTTP checks will fail")
    check(os.path.isfile(os.path.join(ROOT, ".next", "BUILD_ID")), "A0", "production build present (.next/BUILD_ID)",
          "no production build (.next/BUILD_ID): run `pnpm build && pnpm start` for the acceptance run", "WARN")


def a1_structure():
    pj_path = os.path.join(ROOT, "package.json")
    if not os.path.isfile(pj_path):
        rec("FAIL", "A1", "package.json missing")
        return
    pj = json.load(open(pj_path))
    scripts = pj.get("scripts", {})
    need = ["dev", "build", "start", "lint", "typecheck", "migrate", "hola:health", "hola:schema", "hola:seed",
            "hola:placeholders", "hola:samples", "hola:urls", "hola:token", "hola:preview-url",
            "hola:test-session", "hola:settings", "hola:inquiries", "hola:retention"]
    missing = [s for s in need if s not in scripts]
    check(not missing, "A1", "package.json scripts present", f"package.json scripts missing: {', '.join(missing)}")
    files = ["src/payload.config.ts", "src/i18n/routing.ts", "src/messages/es.json", "src/messages/en.json",
             "src/lib/mail.ts", "src/lib/whatsapp.ts"]
    for f in files:
        check(os.path.isfile(os.path.join(ROOT, f)), "A1", f"{f}", f"{f} missing")
    check(any(os.path.isfile(os.path.join(ROOT, f)) for f in ("src/proxy.ts", "src/middleware.ts")), "A1",
          "request interceptor (src/proxy.ts or src/middleware.ts)", "src/proxy.ts / src/middleware.ts missing")
    mig = os.path.join(ROOT, "src", "migrations")
    n = len([f for f in os.listdir(mig) if f.endswith(".ts") and f != "index.ts"]) if os.path.isdir(mig) else 0
    check(n >= 1, "A1", f"{n} Payload migration(s)", "no Payload migrations in src/migrations")
    deps = {**pj.get("dependencies", {}), **pj.get("devDependencies", {})}
    bad = [d for d in deps if d in ("tailwindcss", "sass", "node-sass", "styled-components", "jquery", "bootstrap")
           or d.startswith("@emotion/") or d.startswith("@mui/") or d.startswith("@chakra-ui/")]
    check(not bad, "A1", "no forbidden styling/UI dependencies", f"forbidden dependencies: {', '.join(bad)}")
    hits = []
    for base, _, fs in os.walk(os.path.join(ROOT, "src")):
        for f in fs:
            p = os.path.join(base, f)
            if f.endswith((".scss", ".sass")):
                hits.append(os.path.relpath(p, ROOT))
            if f.endswith((".ts", ".tsx", ".css", ".js", ".mjs")):
                try:
                    t = open(p, encoding="utf-8", errors="ignore").read()
                except OSError:
                    continue
                if "next/font/google" in t or "fonts.googleapis" in t or "fonts.gstatic" in t:
                    hits.append(os.path.relpath(p, ROOT))
    check(not hits, "A1", "no Google Fonts, next/font/google or Sass in src/",
          f"Google Fonts / Sass found in: {', '.join(hits[:5])}")
    leaked = []
    pub = os.path.join(ROOT, "public")
    for base, _, fs in os.walk(pub):
        for f in fs:
            if f in ("START-HERE.md", "CLAUDE.md", "BUILD-LOG.md", "BUILD-REPORT.md") or re.match(r"0\d-[A-Z-]+\.md$", f) \
                    or f.startswith(".env") or f in ("homepage-mockup.jpeg", "original-logo.jpeg"):
                leaked.append(os.path.relpath(os.path.join(base, f), ROOT))
    check(not leaked, "A1", "no kit files in public/", f"kit files in public/: {', '.join(leaked)}")


def a2_gates():
    if os.environ.get("ACCEPT_SKIP_GATES") == "1" or PREFLIGHT:
        rec("WARN", "A2", "lint/typecheck skipped (ACCEPT_SKIP_GATES or --preflight); never skip in the final run")
        return
    if not os.path.isfile(os.path.join(ROOT, "package.json")):
        rec("FAIL", "A2", "no package.json")
        return
    code, out, err = run("pnpm -s lint", timeout=900)
    check(code == 0, "A2", "pnpm lint passes", f"pnpm lint failed (exit {code}): {(out + err).strip()[-300:]}")
    code, out, err = run("pnpm -s typecheck", timeout=900)
    check(code == 0, "A2", "pnpm typecheck passes", f"pnpm typecheck failed (exit {code}): {(out + err).strip()[-300:]}")


def get_preview_cookie():
    if not STATE["server"]:
        return None
    if not PREVIEW_KEY:
        return None
    r = http("/?hola_preview=" + urllib.parse.quote(PREVIEW_KEY))
    val = set_cookie_value(r, "hola_preview")
    STATE["preview_resp"] = r
    if val:
        STATE["cookie"] = {"hola_preview": val}
    return val


def a5_coming_soon():
    if not STATE["server"]:
        rec("FAIL", "A5", "server not reachable")
        return
    r = http("/")
    ok = check(r.status == 503, "A5", "visitor gets 503 on /", f"visitor got {r.status} on / (expected 503)")
    if ok:
        check(r.h("Retry-After"), "A5", "Retry-After header", "Retry-After header missing")
        check("noindex" in (r.h("X-Robots-Tag") or "").lower(), "A5", "X-Robots-Tag noindex",
              "X-Robots-Tag: noindex missing")
        check("no-store" in (r.h("Cache-Control") or "").lower(), "A5", "Cache-Control no-store",
              "Cache-Control: no-store missing on the coming-soon page")
        p = parse(r.text)
        check(p.lang == "es" and "Muy pronto" in p.title, "A5", "coming-soon page (lang es, title 'Muy pronto')",
              f"coming-soon page: lang={p.lang!r}, title={p.title.strip()[:60]!r}")
        check("noindex" in (p.meta("robots") or ""), "A5", "coming-soon robots meta noindex",
              "coming-soon page lacks <meta name=robots content=noindex>")
    r = http("/en/egypt-tours/")
    check(r.status == 503, "A5", "visitor gets 503 on /en/egypt-tours/", f"visitor got {r.status} on /en/egypt-tours/")
    r = http("/", cookies={"payload-token": "garbage"})
    check(r.status == 503, "A5", "invalid payload-token is treated as a visitor",
          f"payload-token=garbage got {r.status} (must be 503)")
    r = http("/?hola_preview=wrong-key-" + str(int(time.time())))
    check(r.status in (503, 307, 302) and not set_cookie_value(r, "hola_preview"), "A5", "wrong preview key sets no cookie",
          f"wrong preview key: status {r.status}, cookie set={bool(set_cookie_value(r, 'hola_preview'))}")
    r = http("/admin")
    hops, url = 0, BASE + "/admin"
    while r.status in (301, 302, 303, 307, 308) and hops < 3:
        url = urllib.parse.urljoin(url, r.h("Location") or "/")
        r = http(url)
        hops += 1
    st = r.status
    check(st == 200, "A5", "/admin reachable", f"/admin answered {st}")
    r = http("/api/hola/token")
    tok_ok = r.status == 200
    try:
        tok_ok = tok_ok and bool(json.loads(r.text).get("token"))
    except ValueError:
        tok_ok = False
    check(tok_ok, "A5", "/api/hola/token reachable for visitors", f"/api/hola/token answered {r.status}")
    check("no-store" in (r.h("Cache-Control") or "").lower(), "A5", "token is no-store",
          "/api/hola/token lacks Cache-Control: no-store")
    for path in ("/robots.txt", "/favicon.ico", "/manifest.webmanifest", "/sitemap.xml", "/icon.svg", "/apple-icon.png"):
        r = http(path)
        check(r.status == 200, "A5", f"{path} passes through (200)", f"{path} answered {r.status}")


def a6_preview_and_session():
    if not STATE["server"]:
        rec("FAIL", "A6", "server not reachable")
        return
    if not PREVIEW_KEY:
        rec("FAIL", "A6", "HOLA_PREVIEW_KEY missing in .env.local")
        return
    val = get_preview_cookie()
    r = STATE.get("preview_resp")
    check(r is not None and r.status in (302, 303, 307, 308), "A6", "preview link redirects",
          f"preview link answered {r.status if r else 'n/a'} (expected 307)")
    loc = (r.h("Location") or "") if r else ""
    check(val and "hola_preview" not in loc, "A6", "preview cookie set; redirect drops the parameter",
          "preview link did not set the hola_preview cookie (or kept the key in the redirect)")
    if not val:
        return
    r = http("/", cookies=STATE["cookie"])
    check(r.status == 200 and "Muy pronto" not in parse(r.text).title, "A6", "preview cookie shows the real site",
          f"with preview cookie / answered {r.status}")
    data = hola_json("test-session create")
    if not data or not data.get("token"):
        rec("FAIL", "A6", "`pnpm hola:test-session create` did not return a token")
        return
    try:
        r = http("/en/", cookies={"payload-token": data["token"]})
        check(r.status == 200, "A6", "admin session shows the real site", f"admin session got {r.status} on /en/")
    finally:
        d = hola_json("test-session delete")
        check(d is not None and d.get("deleted", 0) >= 1, "A6", "temporary test user deleted",
              "`pnpm hola:test-session delete` did not delete the test user")


def a3_model():
    schema = hola_json("schema")
    STATE["schema"] = schema
    if not schema:
        rec("FAIL", "A3", "`pnpm hola:schema` did not print JSON")
        return
    cols = schema.get("collections", {})
    gls = schema.get("globals", {})
    common = ["title", "slug", "available", "excerpt", "featured_image", "seo", "holaSample"]
    trip = ["overview", "subtitle", "gallery", "price_from_eur", "price_from_usd", "price_basis", "price_note",
            "group_type", "group_min", "group_max", "guide_languages", "highlights", "itinerary", "includes",
            "excludes", "what_to_bring", "availability_days", "season_note", "cancellation_policy", "faq",
            "related_trips", "booking_mode", "booking_url", "last_reviewed", "featured", "destinations"]
    tax = ["name", "slug", "hero", "h1", "intro", "seo_text", "faq"]
    req = {
        "tours": common + trip + ["duration_days", "duration", "trip_style", "guides"],
        "cruises": common + trip + ["nights", "cruise_type", "trip_style", "ship_name", "ship_category", "embark",
                                    "disembark", "start_dates", "cabins", "ship_facilities", "deck_plan"],
        "excursions": common + trip + ["duration_hours", "departure", "start_times", "pickup_areas",
                                       "child_price_eur", "child_price_usd", "min_age", "activity_level"],
        "destinations": common + ["content", "region", "tagline", "best_months", "days_recommended",
                                  "how_to_get_there", "nearest_airport", "top_sights", "lat", "lng", "nearby"],
        "guides": common + ["content", "guide_topic", "last_updated", "toc", "related_destinations",
                            "related_trips", "author_name"],
        "pages": ["title", "slug", "available", "template", "holaSample"],
        "inquiries": ["form", "trip", "interests", "adults", "name", "email", "consent_at", "lang", "page_url",
                      "utm", "gclid", "fbclid", "landing", "status", "tracked", "ip_hash", "holaSample"],
        "media": ["alt", "holaSample"],
        "users": ["role"],
        "durations": tax, "trip-styles": tax, "cruise-types": tax, "departures": tax + ["destination"],
        "regions": tax, "guide-topics": tax,
    }
    for c, fields in req.items():
        if c not in cols:
            rec("FAIL", "A3", f"collection `{c}` missing")
            continue
        have = set(f.split(".")[0] for f in cols[c])
        miss = [f for f in fields if f not in have]
        check(not miss, "A3", f"collection `{c}` fields", f"collection `{c}` missing fields: {', '.join(miss)}")
    ss = ["whatsapp_number", "contact_email", "phone", "address", "legal_name", "licence_number", "gtm_id",
          "social", "whatsapp_message_default", "reply_hours", "booking_band", "stats", "trust_items",
          "archive_intros", "cancellation_policies", "og_default"]
    if "site-settings" in gls:
        have = set(f.split(".")[0] for f in gls["site-settings"])
        miss = [f for f in ss if f not in have]
        check(not miss, "A3", "global `site-settings` fields", f"`site-settings` missing: {', '.join(miss)}")
    else:
        rec("FAIL", "A3", "global `site-settings` missing")
    check("navigation" in gls, "A3", "global `navigation`", "global `navigation` missing")


def a4_i18n():
    schema = STATE.get("schema") or {}
    check(schema.get("locales") == ["es", "en"] and schema.get("defaultLocale") == "es", "A4",
          "Payload locales es (default) + en",
          f"locales {schema.get('locales')!r}, default {schema.get('defaultLocale')!r}")
    if not STATE.get("cookie"):
        rec("FAIL", "A4", "no preview cookie; cannot fetch pages")
        return
    for path, lang in (("/", "es"), ("/en/", "en")):
        r = http(path, cookies=STATE["cookie"])
        p = parse(r.text)
        check(r.status == 200 and p.lang == lang, "A4", f"{path} → 200, lang={lang}",
              f"{path} answered {r.status} with lang={p.lang!r}")
    r = http("/viajes-a-egipto", cookies=STATE["cookie"])
    loc = r.h("Location") or ""
    check(r.status in (301, 308) and loc.rstrip("?").endswith("/viajes-a-egipto/"), "A4",
          "no-slash URL redirects to the slashed URL", f"/viajes-a-egipto answered {r.status} → {loc!r} (expected 308)")
    r = http("/en/no-existe-hola-404/", cookies=STATE["cookie"])
    check(r.status == 404 and parse(r.text).lang == "en", "A4", "unknown English path → 404 (lang en)",
          f"/en/no-existe-hola-404/ answered {r.status}")


def page_checks(group, lang, path, index, r):
    """Return a list of problems for one HTML page."""
    probs = []
    t = r.text
    p = parse(t)
    if p.lang != lang:
        probs.append(f"lang={p.lang!r}")
    if group != "404" and p.h1 != 1:
        probs.append(f"{p.h1} <h1>")
    if not p.title.strip():
        probs.append("empty <title>")
    robots = (p.meta("robots") or "").lower()
    if index == "1" and "noindex" in robots:
        probs.append("noindex on an indexable page")
    if index == "0" and "noindex" not in robots:
        probs.append("missing noindex")
    canon = p.link_rel("canonical")
    if index == "1":
        want = SITE + path
        if not canon or canon[0].get("href") != want:
            probs.append(f"canonical {canon[0].get('href') if canon else None!r} != {want!r}")
        alts = {l.get("hreflang"): l.get("href") for l in p.link_rel("alternate") if l.get("hreflang")}
        if not {"es", "en", "x-default"} <= set(alts):
            probs.append(f"hreflang {sorted(alts)}")
        elif alts.get("x-default") != alts.get("es"):
            probs.append("x-default != es")
        elif alts.get(lang) != want:
            probs.append(f"hreflang {lang} != self")
    if "__next_error__" in t or "Application error" in t:
        probs.append("Next.js error page markup")
    if group != "404":
        objs, bad = p.jsonld()
        if bad:
            probs.append(f"{bad} invalid JSON-LD block(s)")
        types = ld_types(objs)
        need = {"TravelAgency"}
        if group != "home":
            need.add("BreadcrumbList")
        if group == "single":
            for base, kind in PAYLOAD_TRIP_BASES.items():
                if path.startswith(base) and base not in ("/", "/en/"):
                    need.add("TouristTrip")
            if path.startswith(DEST_BASES):
                need.add("TouristDestination")
            if path.startswith(GUIDE_BASES):
                need.add("Article")
        miss = need - types
        if miss:
            probs.append(f"JSON-LD missing {sorted(miss)}")
        raw = json.dumps(objs)
        if "AggregateRating" in raw or '"Review"' in raw:
            probs.append("AggregateRating/Review in JSON-LD")
    no_alt = [i.get("src", "")[:40] for i in p.imgs if "alt" not in i]
    if no_alt:
        probs.append(f"{len(no_alt)} <img> without alt")
    head_dl = any(s["in_head"] and not s["attrs"].get("src") and "dataLayer" in s["text"] for s in p.scripts)
    if not head_dl:
        probs.append("no inline dataLayer bootstrap in <head>")
    if group == "single" and any(path.startswith(b) for b in PAYLOAD_TRIP_BASES if b not in ("/", "/en/")):
        if "view_item" not in t:
            probs.append("no view_item on a trip page")
    first_a = p.anchors[0] if p.anchors else {}
    if first_a.get("href") != "#main" or "main" not in p.ids:
        probs.append("first link is not the skip link to #main")
    low = p.visible_text.lower()
    claims = [c for c in FORBIDDEN_CLAIMS if c in low]
    if claims:
        probs.append(f"forbidden claims: {claims}")
    return probs, p


def a7_urls():
    if not STATE.get("cookie"):
        rec("FAIL", "A7", "no preview cookie; cannot crawl")
        return
    code, out = hola("urls")
    rows = []
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) == 5 and parts[2].startswith("/"):
            rows.append(parts)
    STATE["urls"] = rows
    if not rows:
        rec("FAIL", "A7", "`pnpm hola:urls` printed no rows")
        return
    paths = {r[2] for r in rows}
    groups = {}
    for g, *_ in rows:
        groups[g] = groups.get(g, 0) + 1
    miss = [p for p in REQUIRED_ARCHIVES + REQUIRED_PAGES if p not in paths]
    check(not miss, "A7", "URL list covers home, archives and fixed pages in both languages",
          f"URL list is missing: {', '.join(miss[:8])}{' …' if len(miss) > 8 else ''}")
    check(groups.get("single", 0) >= 36, "A7", f"{groups.get('single', 0)} single URLs (≥ 36 = 18 samples × 2)",
          f"only {groups.get('single', 0)} single URLs (expected ≥ 36)")
    check(groups.get("term", 0) >= 2 and groups.get("search", 0) == 2 and groups.get("404", 0) == 2, "A7",
          "term, search and 404 rows present", f"row groups: {groups}")
    bad, ok = 0, 0
    for g, lang, path, expect, index in rows:
        r = http(path, cookies=STATE["cookie"])
        if str(r.status) != expect:
            bad += 1
            print(f"    ✗ {path} → {r.status} (expected {expect})")
            continue
        if "text/html" not in (r.h("Content-Type") or ""):
            bad += 1
            print(f"    ✗ {path} → not HTML")
            continue
        probs, _ = page_checks(g, lang, path, index, r)
        if probs:
            bad += 1
            print(f"    ✗ {path}: {'; '.join(probs)}")
        else:
            ok += 1
    if bad == 0:
        rec("PASS", "A7", f"all {ok} URLs answered as expected and passed page checks")
    else:
        rec("FAIL", "A7", f"{bad} of {len(rows)} URLs failed (details above)")
    # filtered state
    r = http("/viajes-a-egipto/?duration=7-9-dias", cookies=STATE["cookie"])
    p = parse(r.text)
    check(r.status == 200 and "noindex" in (p.meta("robots") or "") and "follow" in (p.meta("robots") or "")
          and not p.link_rel("canonical"), "A7", "filtered archive is noindex, follow without canonical",
          f"filtered archive: status {r.status}, robots {p.meta('robots')!r}, canonical {bool(p.link_rel('canonical'))}")
    # robots + sitemap
    r = http("/robots.txt")
    t = r.text
    check("Disallow: /admin" in t and "Sitemap:" in t, "A7", "robots.txt rules", "robots.txt lacks Disallow: /admin or Sitemap:")
    r = http("/sitemap.xml")
    t = r.text
    check(r.status == 200 and SITE + "/viajes-a-egipto/" in t and SITE + "/en/egypt-tours/" in t and "/gracias/" not in t
          and "xhtml:link" in t, "A7", "sitemap.xml lists both languages with alternates, no thank-you",
          "sitemap.xml incomplete (needs both archives, xhtml:link alternates, no /gracias/)")


def a8_inquiry():
    if not STATE["server"]:
        rec("FAIL", "A8", "server not reachable")
        return
    before = hola_json("inquiries count")
    if before is None:
        rec("FAIL", "A8", "`pnpm hola:inquiries count` failed")
        return
    log_path = os.path.join(ROOT, ENV.get("HOLA_MAIL_LOG") or "kit/logs/mail.log")
    log_before = open(log_path, encoding="utf-8", errors="replace").read().splitlines() if os.path.isfile(log_path) else []
    code, token = hola("token")
    token = token.strip().splitlines()[-1] if token.strip() else ""
    if code != 0 or not re.match(r"^\d+\.[0-9a-f]{64}$", token):
        rec("FAIL", "A8", "`pnpm hola:token` did not print a <ts>.<hex64> token")
        return
    T = {"X-Hola-Test": "1"}
    base = {"form": "plan_my_trip", "lang": "es", "token": token, "website": "", "name": "Prueba Aceptación",
            "email": "acceptance@hola.test", "consent": "1", "adults": 2, "message": "Acceptance test",
            "utm_source": "acceptance", "utm_medium": "test", "utm_campaign": "es_test_leads_202610"}
    r = http("/api/hola/inquiry", "POST", T, base)
    js = {}
    try:
        js = json.loads(r.text)
    except ValueError:
        pass
    redirect = js.get("redirect", "") if isinstance(js, dict) else ""
    check(r.status == 201 and js.get("ok") is True and redirect.startswith("/gracias/?ref="), "A8",
          "valid JSON inquiry → 201 with thank-you redirect",
          f"valid inquiry answered {r.status} {r.text[:160]!r}")
    STATE["thanks"] = redirect
    bad = dict(base)
    bad.pop("email")
    r = http("/api/hola/inquiry", "POST", T, bad)
    try:
        e = json.loads(r.text).get("errors", {})
    except ValueError:
        e = {}
    check(r.status == 422 and "email" in e, "A8", "missing email → 422 errors.email", f"missing email answered {r.status}")
    hp = dict(base, website="http://spam.example")
    r = http("/api/hola/inquiry", "POST", T, hp)
    check(r.status == 400, "A8", "honeypot → 400", f"honeypot answered {r.status}")
    bt = dict(base, token=str(int(time.time()) - 60) + "." + "0" * 64)
    r = http("/api/hola/inquiry", "POST", T, bt)
    check(r.status == 400, "A8", "forged token → 400", f"forged token answered {r.status}")
    form = {"form": "plan_my_trip", "lang": "en", "token": token, "website": "", "name": "Acceptance Test",
            "email": "acceptance@hola.test", "consent": "1", "adults": "2", "page_url": SITE + "/en/plan-my-trip/"}
    r = http("/api/hola/inquiry", "POST", dict(T, **{"Content-Type": "application/x-www-form-urlencoded"}),
             urllib.parse.urlencode(form))
    loc = r.h("Location") or ""
    check(r.status == 303 and "/en/thank-you/?ref=" in loc, "A8", "form-encoded (no JS) inquiry → 303 to /en/thank-you/",
          f"form-encoded inquiry answered {r.status} → {loc!r}")
    after = hola_json("inquiries count") or {}
    check(after.get("total", 0) - before.get("total", 0) == 2 and after.get("sample", 0) - before.get("sample", 0) == 2,
          "A8", "exactly the 2 valid inquiries were stored, flagged as samples",
          f"inquiries total {before.get('total')}→{after.get('total')}, sample {before.get('sample')}→{after.get('sample')}")
    last = hola_json("inquiries last") or {}
    check(last.get("lang") == "en" and last.get("holaSample") is True and last.get("status") == "new", "A8",
          "stored inquiry fields (lang, holaSample, status new)", f"last inquiry: {json.dumps(last)[:160]}")
    log_after = open(log_path, encoding="utf-8", errors="replace").read().splitlines() if os.path.isfile(log_path) else []
    new = log_after[len(log_before):]
    admin = ENV.get("ADMIN_EMAIL", "")
    allowed = {"(not-sent)"} | ({admin} if admin else set())
    tos = [re.search(r"\tto=([^\t]*)", l).group(1) if re.search(r"\tto=([^\t]*)", l) else "?" for l in new]
    check(len(new) >= 2, "A8", f"{len(new)} new mail-log lines", f"only {len(new)} new lines in {os.path.relpath(log_path, ROOT)} (expected ≥ 2)")
    check(new and all(t in allowed for t in tos), "A8", "mail goes only to ADMIN_EMAIL (or is not sent)",
          "mail log shows recipients other than ADMIN_EMAIL / (not-sent)")


def a9_thanks():
    path = STATE.get("thanks")
    if not path or not STATE.get("cookie"):
        rec("FAIL", "A9", "no thank-you URL from A8")
        return

    def lead_pushes(r):
        p = parse(r.text)
        return sum(1 for s in p.scripts if not s["attrs"].get("src")
                   and not s["text"].lstrip().startswith("self.__next_f")
                   and "generate_lead" in s["text"]), p

    r = http(path, cookies=STATE["cookie"])
    n, p = lead_pushes(r)
    check(r.status == 200 and n == 1, "A9", "thank-you page fires generate_lead once",
          f"thank-you: status {r.status}, {n} inline generate_lead push(es)")
    check("noindex" in (p.meta("robots") or ""), "A9", "thank-you is noindex", "thank-you page lacks noindex")
    r = http(path, cookies=STATE["cookie"])
    n, _ = lead_pushes(r)
    check(n == 0, "A9", "a reload does not fire generate_lead again", f"reload fired generate_lead {n} time(s)")
    bad = path.split("?")[0] + "?ref=1." + "0" * 64
    r = http(bad, cookies=STATE["cookie"])
    n, _ = lead_pushes(r)
    check(n == 0, "A9", "a forged ref fires nothing", f"forged ref fired generate_lead {n} time(s)")


def revalidate():
    return http("/api/hola/revalidate", "POST", {"x-hola-revalidate": PREVIEW_KEY}, {"all": True}).status


def a10_whatsapp():
    if not STATE.get("cookie"):
        rec("FAIL", "A10", "no preview cookie")
        return
    trip = next((r for r in STATE["urls"] if r[0] == "single" and r[1] == "es" and r[2].startswith("/viajes-a-egipto/")), None)
    if not trip:
        rec("FAIL", "A10", "no Spanish tour URL in hola:urls")
        return
    path = trip[2]
    st = revalidate()
    check(st == 200, "A10", "POST /api/hola/revalidate works", f"/api/hola/revalidate answered {st}")
    r = http("/api/hola/revalidate", "POST", {"x-hola-revalidate": "wrong"}, {"all": True})
    check(r.status == 401, "A10", "revalidate refuses a wrong key", f"revalidate with a wrong key answered {r.status}")
    orig = hola_json("settings get whatsapp_number")
    orig = orig if isinstance(orig, str) else ""
    test_number = orig or "34600000000"
    try:
        if not orig:
            code, _ = hola(f"settings set whatsapp_number {test_number}")
            revalidate()
        links = []
        h1 = ""
        for _ in range(4):
            r = http(path, cookies=STATE["cookie"])
            p = parse(r.text)
            links = [a for a in p.anchors if a.get("href", "").startswith("https://wa.me/")]
            h1 = html.unescape("".join(p.h1_text)).strip()
            if links:
                break
            time.sleep(1.5)
        ok = bool(links) and all(a.get("href", "").startswith(f"https://wa.me/{test_number}?text=") for a in links)
        check(ok, "A10", f"{len(links)} WhatsApp link(s) on a tour page with the configured number",
              f"WhatsApp links on {path}: {len(links)} (expected ≥ 1, all https://wa.me/<number>?text=…)")
        if links:
            attrs_ok = all(a.get("data-he-event") == "whatsapp_click" and a.get("data-he-location") for a in links)
            check(attrs_ok, "A10", "data-he-event/location on every WhatsApp link",
                  "WhatsApp links lack data-he-event=\"whatsapp_click\" or data-he-location")
            trip_links = [a for a in links if a.get("data-he-trip")]
            msgs = [urllib.parse.unquote(urllib.parse.urlparse(a["href"]).query.split("text=", 1)[-1]) for a in trip_links]
            check(trip_links and h1 and any(h1 in m and (SITE + path) in m for m in msgs), "A10",
                  "trip WhatsApp message names the trip and its URL",
                  "no WhatsApp link with data-he-trip whose message contains the trip title and URL")
    finally:
        if not orig:
            hola("settings set whatsapp_number ''")
            revalidate()
    if not orig:
        for _ in range(4):
            r = http(path, cookies=STATE["cookie"])
            if "wa.me/" not in r.text:
                break
            time.sleep(1.5)
        check("wa.me/" not in r.text, "A10", "no WhatsApp link rendered while the number is empty",
              "WhatsApp links still rendered after clearing the number")


def a11_samples():
    c = hola_json("samples count")
    if not c:
        rec("FAIL", "A11", "`pnpm hola:samples count` failed")
        return
    want = {"tours": 3, "cruises": 2, "excursions": 4, "destinations": 6, "guides": 3}
    for k, n in want.items():
        v = c.get(k, {})
        check(v.get("es") == n and v.get("en") == n, "A11", f"{k}: {n} es / {n} en",
              f"{k}: es={v.get('es')} en={v.get('en')} (expected {n}/{n})")
    check((c.get("media") or 0) >= 30, "A11", f"{c.get('media')} sample images (≥ 30)", f"only {c.get('media')} sample images")
    d = hola_json("samples delete --dry-run")
    wd = (d or {}).get("would_delete", {})
    check(d is not None and wd.get("tours", 0) >= 3 and wd.get("media", 0) >= 30, "A11",
          "samples delete --dry-run reports what it would delete", f"dry run output: {json.dumps(d)[:160]}")
    c2 = hola_json("samples count")
    check(c2 == c, "A11", "dry run changed nothing", "sample counts changed after --dry-run")


def a12_security():
    if not STATE.get("cookie"):
        rec("FAIL", "A12", "no preview cookie")
    else:
        r = http("/", cookies=STATE["cookie"])
        need = {"X-Content-Type-Options": "nosniff", "Referrer-Policy": "", "Permissions-Policy": "",
                "X-Frame-Options": "", "Content-Security-Policy-Report-Only": ""}
        for h, v in need.items():
            got = r.h(h) or ""
            check(got and v in got.lower(), "A12", f"header {h}", f"header {h} missing")
        check(not r.h("X-Powered-By"), "A12", "no X-Powered-By", "X-Powered-By header present")
        probes = {"/kit/START-HERE.md": "kit/START-HERE.md", "/START-HERE.md": "kit/START-HERE.md",
                  "/docs/01-SPEC.md": "kit/docs/01-SPEC.md", "/kit/docs/01-SPEC.md": "kit/docs/01-SPEC.md",
                  "/.env.local": ".env.local", "/.env": ".env.local", "/kit/BUILD-LOG.md": "kit/BUILD-LOG.md",
                  "/kit/bin/acceptance.sh": "kit/bin/acceptance.sh", "/kit/docs/03-CONTRACTS.md": "kit/docs/03-CONTRACTS.md"}
        for path, local in probes.items():
            r = http(path, cookies=STATE["cookie"])
            hops = 0
            while r.status in (301, 302, 303, 307, 308) and hops < 3:
                r = http(urllib.parse.urljoin(BASE + path, r.h("Location") or "/"), cookies=STATE["cookie"])
                hops += 1
            lp = os.path.join(ROOT, local)
            marker = ""
            if os.path.isfile(lp):
                lines = [l.strip() for l in open(lp, encoding="utf-8", errors="ignore") if len(l.strip()) > 12]
                marker = lines[0][:60] if lines else ""
            leaked = r.status == 200 and ((marker and marker in r.text) or "text/html" not in (r.h("Content-Type") or ""))
            check(not leaked, "A12", f"{path} not served (final {r.status})", f"{path} is served from the kit")
    for path in ("/api/users", "/api/inquiries"):
        r = http(path)
        check(r.status in (401, 403), "A12", f"logged-out GET {path} refused ({r.status})",
              f"logged-out GET {path} answered {r.status}")
    code, _, _ = run("git ls-files --error-unmatch .env.local")
    check(code != 0, "A12", ".env.local is not tracked", ".env.local is tracked by git")
    code, _, _ = run("git check-ignore -q .env.local")
    check(code == 0, "A12", ".env.local is gitignored", ".env.local is not gitignored")
    leaks = 0
    for k in ("PAYLOAD_SECRET", "HOLA_PREVIEW_KEY", "DATABASE_URI", "SMTP_PASS", "TURNSTILE_SECRET_KEY", "HOLA_WEBHOOK_SECRET"):
        v = ENV.get(k, "")
        if len(v) >= 8:
            p = subprocess.run(["git", "grep", "-F", "-q", "-e", v, "HEAD", "--"], cwd=ROOT, capture_output=True)
            if p.returncode == 0:
                leaks += 1
            for f in ("kit/BUILD-LOG.md", "kit/BUILD-REPORT.md", "kit/reports/last-run.txt"):
                fp = os.path.join(ROOT, f)
                if os.path.isfile(fp) and v in open(fp, encoding="utf-8", errors="ignore").read():
                    leaks += 1
    check(leaks == 0, "A12", "no secret values in git, the log or the report",
          f"{leaks} secret value occurrence(s) found in git/log/report (values not shown)")


def gz(b):
    return len(gzip.compress(b, 9))


def a13_performance():
    if not STATE.get("cookie"):
        rec("FAIL", "A13", "no preview cookie")
        return
    r = http("/", cookies=STATE["cookie"])
    p = parse(r.text)
    css = [l.get("href") for l in p.link_rel("stylesheet") if l.get("href", "").startswith("/")]
    css_gz = sum(gz(http(h, cookies=STATE["cookie"]).body) for h in css)
    inline_css = sum(gz(m.encode()) for m in re.findall(r"<style[^>]*>(.*?)</style>", r.text, re.S))
    total_css = css_gz + inline_css
    check(total_css <= 40 * 1024, "A13", f"CSS {total_css / 1024:.1f} KB gz (≤ 40)", f"CSS {total_css / 1024:.1f} KB gz > 40 KB")
    js = [s["attrs"].get("src") for s in p.scripts
          if s["attrs"].get("src", "").startswith("/") and "nomodule" not in s["attrs"]]
    js_gz = sum(gz(http(s, cookies=STATE["cookie"]).body) for s in js)
    check(js_gz <= 200 * 1024, "A13", f"first-load JS {js_gz / 1024:.1f} KB gz (≤ 200, framework included)",
          f"first-load JS {js_gz / 1024:.1f} KB gz > 200 KB")
    check(not any("jquery" in (s or "").lower() for s in js), "A13", "no jQuery", "jQuery loaded")
    pre = [l.get("href", "") for l in p.links if "preload" in l.get("rel", "") and l.get("as") == "font"]
    want = {"/fonts/fraunces-latin-600-normal.woff2", "/fonts/plus-jakarta-sans-latin-400-normal.woff2"}
    check(len(pre) == 2 and {urllib.parse.urlparse(h).path for h in pre} == want, "A13", "exactly 2 font preloads",
          f"font preloads: {pre}")
    check(p.link_rel("icon") and p.link_rel("apple-touch-icon") and p.link_rel("manifest"), "A13",
          "favicon, apple-touch-icon and manifest links in <head>", "favicon/apple-touch-icon/manifest link missing")
    hero = [i for i in p.imgs if i.get("fetchpriority") == "high"]
    check(hero and hero[0].get("loading") != "lazy", "A13", "home hero image has fetchpriority=high (not lazy)",
          "no <img fetchpriority=\"high\"> on home (or it is lazy)")
    lazy = [i for i in p.imgs if i.get("loading") == "lazy"]
    check(lazy, "A13", f"{len(lazy)} lazy images on home", "no lazy-loaded images on home", "WARN")
    t = http("/", cookies=STATE["cookie"]).elapsed
    check(t <= 0.6, "A13", f"home response {t * 1000:.0f} ms (≤ 600, local)", f"home response {t * 1000:.0f} ms > 600 ms", "WARN")
    check(r.text.count('rel="stylesheet"') + r.text.count("<style") <= 12, "A13", "stylesheet count reasonable",
          "more than 12 stylesheets on home", "WARN")


def a14_logs():
    path = os.path.join(KIT, "logs", "server.log")
    if not os.path.isfile(path):
        rec("WARN", "A14", "kit/logs/server.log not found (start the server with output appended there)")
        return
    text = open(path, encoding="utf-8", errors="replace").read()[-400000:]
    errs = [l for l in text.splitlines() if re.search(r"\b(Error|TypeError|ReferenceError|Unhandled)\b|⨯", l)]
    check(not errs, "A14", "no errors in kit/logs/server.log (last 400 KB)",
          f"{len(errs)} error line(s) in kit/logs/server.log, e.g. {errs[-1][:160] if errs else ''}", "WARN")


def a15_git():
    code, out, _ = run("git rev-list --count HEAD")
    n = int(out.strip()) if code == 0 and out.strip().isdigit() else 0
    check(n >= 13, "A15", f"{n} commits", f"{n} commits (expected ≥ 13, one per step)")
    code, out, _ = run("git status --porcelain")
    dirty = [l for l in out.splitlines() if l[3:] not in ("kit/BUILD-LOG.md", "kit/BUILD-REPORT.md")]
    check(code == 0 and not dirty, "A15", "working tree clean (except BUILD-LOG / BUILD-REPORT)",
          f"uncommitted changes: {', '.join(l[3:] for l in dirty[:6])}")
    code, out, _ = run("git ls-files src/migrations")
    check(code == 0 and out.strip(), "A15", "migrations committed", "src/migrations not committed")
    ex = read_env(os.path.join(ROOT, ".env.example"))
    names = ["DATABASE_URI", "PAYLOAD_SECRET", "NEXT_PUBLIC_SITE_URL", "HOLA_COMING_SOON", "HOLA_PREVIEW_KEY",
             "HOLA_DEV_MODE", "ADMIN_EMAIL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM",
             "TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "N8N_WEBHOOK_URL", "HOLA_WEBHOOK_SECRET", "HOLA_MAIL_LOG"]
    if ex is None:
        rec("FAIL", "A15", ".env.example missing")
    else:
        miss = [k for k in names if k not in ex]
        secret_vals = [k for k in ("DATABASE_URI", "PAYLOAD_SECRET", "HOLA_PREVIEW_KEY", "SMTP_PASS",
                                   "TURNSTILE_SECRET_KEY", "HOLA_WEBHOOK_SECRET") if ex.get(k)]
        check(not miss and not secret_vals, "A15", ".env.example lists every key with no secret values",
              f".env.example: missing {miss}, non-empty secrets {secret_vals}")
    code, _, _ = run("git ls-files --error-unmatch .env.example")
    check(code == 0, "A15", ".env.example committed", ".env.example not committed")


def a16_owner_inputs():
    for f, label in (("whatsapp_number", "WhatsApp Business number"), ("contact_email", "contact email"),
                     ("legal_name", "legal company name"), ("licence_number", "tourism licence number"),
                     ("gtm_id", "GTM container ID")):
        v = hola_json(f"settings get {f}")
        if v is None:
            rec("FAIL", "A16", f"`pnpm hola:settings get {f}` failed")
        else:
            rec("PASS" if v else "BLOCKED", "A16", f"{label} ({f}) {'set' if v else 'empty — owner input'}")
    for k, label in (("ADMIN_EMAIL", "admin email for dev mail"), ("SMTP_HOST", "SMTP"),
                     ("TURNSTILE_SITE_KEY", "Turnstile keys"), ("N8N_WEBHOOK_URL", "n8n webhook")):
        rec("PASS" if ENV.get(k) else "BLOCKED", "A16", f"{label} ({k}) {'set' if ENV.get(k) else 'empty — owner input'}")


def main():
    started = datetime.datetime.now()
    print(f"Hola Egipto acceptance — {started:%Y-%m-%d %H:%M} — {BASE}{' — PREFLIGHT' if PREFLIGHT else ''}")
    steps = [a0_environment, a1_structure, a2_gates, a5_coming_soon, a6_preview_and_session, a3_model, a4_i18n,
             a7_urls, a8_inquiry, a9_thanks, a10_whatsapp, a11_samples, a12_security, a13_performance, a14_logs,
             a15_git, a16_owner_inputs]
    for fn in steps:
        cid = "A" + re.match(r"a(\d+)", fn.__name__).group(1)
        try:
            fn()
        except Exception as e:  # a crash in one check must not hide the others
            rec("FAIL", cid, f"check crashed: {type(e).__name__}: {str(e)[:200]}")
    summary = f"ACCEPTANCE SUMMARY: pass={COUNTS['PASS']} fail={COUNTS['FAIL']} warn={COUNTS['WARN']} blocked={COUNTS['BLOCKED']}"
    try:
        rep = os.path.join(KIT, "reports")
        os.makedirs(rep, exist_ok=True)
        lines = [f"# Acceptance run {started:%Y-%m-%d %H:%M}", "", f"`{summary}`", "", "| Status | Check | Detail |",
                 "| --- | --- | --- |"]
        lines += [f"| {s} | {c} | {m.replace('|', '/')} |" for s, c, m in RESULTS]
        md = "\n".join(lines) + "\n"
        open(os.path.join(rep, f"acceptance-{started:%Y%m%d-%H%M%S}.md"), "w").write(md)
        open(os.path.join(rep, "acceptance-latest.md"), "w").write(md)
    except OSError as e:
        print(f"(could not write report: {e})")
    print(summary)
    sys.exit(0 if COUNTS["FAIL"] == 0 else 1)


if __name__ == "__main__":
    main()
