import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import ThemeToggle from '../ui/ThemeToggle'

const POINTS = [
  'Folders that match how mail is actually filed',
  'Stars, drafts, and archive without the noise',
  'A reading pane that gets out of the way on a phone',
]

export default function AuthShell({ children }) {
  return (
    <div className="h-dvh overflow-hidden bg-canvas lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <aside className="brand-panel relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
        <div className="flex items-center justify-between">
          <Logo light />
          <ThemeToggle tone="inverse" />
        </div>
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Local mail</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-white xl:text-6xl">
            A calmer desk for the mail that matters.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
            Sablefinch keeps reading, writing, and filing in one quiet place. No feed. No noise. Just the thread.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#e2a33a]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 flex items-end justify-between gap-6">
          <p className="text-sm text-white/65">Stored in this browser. Nothing is sent to a server.</p>
          <div className="pointer-events-none w-64 -rotate-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm" aria-hidden="true">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">Inbox</p>
            <p className="mt-2 font-display text-3xl text-white">3 unread</p>
            <p className="mt-1 text-sm text-white/75">Reservation, review, invoice</p>
          </div>
        </div>
      </aside>
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex shrink-0 items-center justify-between px-4 pt-5 sm:px-8 lg:hidden">
          <Link to="/signin" aria-label="Sablefinch sign in">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <main className="scroll-area flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-8">
          <div className="rise m-auto w-full max-w-[440px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
