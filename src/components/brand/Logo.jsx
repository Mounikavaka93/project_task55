export default function Logo({ light = false, className = '' }) {
  const tile = light ? '#f4f1ea' : 'currentColor'
  const bird = light ? '#14685f' : 'var(--sf-panel)'
  const beak = '#e2a33a'
  return (
    <span className={`inline-flex items-center gap-2.5 text-accent ${className}`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={tile} />
        <ellipse cx="14.6" cy="18.2" rx="6" ry="4.7" fill={bird} />
        <circle cx="20.8" cy="15.1" r="3.15" fill={bird} />
        <path d="M23.5 15.1 28 16.2l-4.4 1.5z" fill={beak} />
        <circle cx="21.7" cy="14.5" r="0.7" fill={light ? '#14685f' : 'currentColor'} />
        <path d="M8.2 17.5c1.8.2 3.5.9 4.7 1.8-2 .6-4.1.6-5.9 0 .2-.8.6-1.5 1.2-1.8z" fill={bird} />
      </svg>
      <span className={`font-display text-[1.45rem] leading-none tracking-tight ${light ? 'text-[#f7f4ee]' : 'text-ink'}`}>
        Sablefinch
      </span>
    </span>
  )
}
