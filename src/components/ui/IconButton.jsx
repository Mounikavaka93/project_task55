export default function IconButton({ label, className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-grid size-9 cursor-pointer place-items-center rounded-lg text-muted transition duration-200 hover:bg-panel-2 hover:text-ink ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
