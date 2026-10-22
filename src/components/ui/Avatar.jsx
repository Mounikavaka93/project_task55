const PALETTE = [
  ['#204e4a', '#e7f6f2'],
  ['#6b3a2a', '#f8e6de'],
  ['#3d3a6b', '#e7e4f8'],
  ['#6b5420', '#f8f0d8'],
  ['#1e3f5a', '#deecf6'],
  ['#5a2a45', '#f8e3ee'],
]

function hash(value) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

export default function Avatar({ name = '', size = 36 }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'
  const [foreground, background] = PALETTE[hash(name) % PALETTE.length]

  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center rounded-full font-semibold"
      style={{ width: size, height: size, background, color: foreground, fontSize: size < 32 ? 11 : 13 }}
    >
      {initials}
    </span>
  )
}
