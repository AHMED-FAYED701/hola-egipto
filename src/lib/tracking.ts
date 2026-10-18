/** dataLayer bootstrap + Consent Mode v2 defaults (contracts §15). Rendered inline as the first script in <head>. */
export const DATALAYER_BOOTSTRAP = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});(function(){try{var m=document.cookie.match(/(?:^|; )hola_consent=([^;]+)/);if(m&&m[1]==='granted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'})}}catch(e){}})();`

export function gtmSnippet(id: string): string {
  const safe = id.replace(/[^A-Z0-9-]/gi, '')
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${safe}');`
}

/** Inline, JSON-safe dataLayer push (for server-rendered events such as view_item). */
export function pushScript(payload: Record<string, unknown>): string {
  return `window.dataLayer=window.dataLayer||[];window.dataLayer.push(${JSON.stringify(payload).replace(/</g, '\\u003c')});`
}
