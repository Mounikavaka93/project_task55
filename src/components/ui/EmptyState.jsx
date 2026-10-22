export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Icon size={26} />
      </span>
      <h2 className="mt-4 font-display text-[1.7rem] leading-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
