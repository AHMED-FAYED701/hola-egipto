import { ImageAltForm } from '@/admin/form/ImageAltForm'
import { ConfirmButton } from '@/admin/form/ConfirmButton'
import { deleteImageAction, saveImageAltAction, scanImagesAction } from '@/admin/global-actions'
import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'
import { listImages } from '@/lib/content/images'

export const metadata = { title: 'Images' }

type Props = { searchParams: Promise<{ q?: string; scanned?: string; deleted?: string }> }

/** Image library (contracts §13): grid, alt ES/EN, scan public/images/ for new files. No uploads. */
export default async function ImagesPage({ searchParams }: Props) {
  await requireUser('/admin/images')
  const { t } = await adminDict()
  const { q = '', scanned, deleted } = await searchParams
  const images = await listImages(q.trim().slice(0, 80))
  return (
    <>
      <h1>{t.images}</h1>
      {scanned !== undefined ? (
        <p className="adm-flash" role="status">
          {t.scanned} {Number(scanned) || 0}
        </p>
      ) : null}
      {deleted ? (
        <p className="adm-flash" role="status">
          {t.deleted}
        </p>
      ) : null}
      <div className="adm-toolbar">
        <form method="get" role="search">
          <input type="search" name="q" defaultValue={q} placeholder={t.searchPlaceholder} aria-label={t.search} />
          <button type="submit" className="adm-btn">
            {t.search}
          </button>
        </form>
        <form action={scanImagesAction}>
          <button type="submit" className="adm-btn">
            {t.scan}
          </button>
        </form>
      </div>
      <div className="adm-cards">
        {images.map((img) => (
          <article key={img.id} className="adm-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.path} alt={img.alt_es} width={240} height={Math.round((240 * img.height) / img.width)} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: 'var(--he-radius-sm)' }} />
            <p className="adm-muted">
              {img.path} · {img.width}×{img.height} {img.hola_sample ? <span className="adm-badge adm-badge--sample">{t.sample}</span> : null}
            </p>
            <ImageAltForm action={saveImageAltAction.bind(null, img.id)} altEs={img.alt_es} altEn={img.alt_en} t={t} />
            <form action={deleteImageAction.bind(null, img.id)}>
              <ConfirmButton label={t.delete} confirm={t.deleteConfirm} />
            </form>
          </article>
        ))}
      </div>
    </>
  )
}
