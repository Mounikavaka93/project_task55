export function SkeletonRows() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="border-b border-line px-4 py-3.5">
          <div className="flex justify-between gap-4">
            <div className="h-3 w-32 rounded-full bg-line" />
            <div className="h-3 w-10 rounded-full bg-line" />
          </div>
          <div className="mt-3 h-3 w-4/5 rounded-full bg-line" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-line" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonReader() {
  return (
    <div className="animate-pulse px-6 py-8" aria-hidden="true">
      <div className="h-8 w-2/3 rounded-full bg-line" />
      <div className="mt-6 h-4 w-40 rounded-full bg-line" />
      <div className="mt-8 space-y-3">
        <div className="h-3 w-full rounded-full bg-line" />
        <div className="h-3 w-11/12 rounded-full bg-line" />
        <div className="h-3 w-4/5 rounded-full bg-line" />
      </div>
    </div>
  )
}
