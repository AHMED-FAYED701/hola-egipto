'use client'

/** Submit button that asks for confirmation first (deletes). */
export function ConfirmButton({ label, confirm, className = 'adm-btn adm-btn--small adm-btn--danger' }: { label: string; confirm: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault()
      }}
    >
      {label}
    </button>
  )
}
