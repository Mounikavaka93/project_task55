const STYLES = {
  primary: 'bg-accent text-accent-ink shadow-[0_8px_20px_rgba(20,104,95,0.18)] hover:bg-accent-strong',
  secondary: 'border border-line bg-panel text-ink hover:bg-panel-2',
  ghost: 'text-ink hover:bg-panel-2',
  danger: 'bg-danger text-danger-ink hover:opacity-90',
}

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
