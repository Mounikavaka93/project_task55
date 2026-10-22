import { useEffect, useRef, useState } from 'react'
import { Bold, Italic, List, ListOrdered, Underline } from 'lucide-react'
import { textFromHtml } from '../../utils/format'

const TOOLS = [
  { label: 'Bold', icon: Bold, command: 'bold' },
  { label: 'Italic', icon: Italic, command: 'italic' },
  { label: 'Underline', icon: Underline, command: 'underline' },
  { label: 'Bulleted list', icon: List, command: 'insertUnorderedList' },
  { label: 'Numbered list', icon: ListOrdered, command: 'insertOrderedList' },
]

export default function Editor({ initialValue, onChange, invalid }) {
  const ref = useRef(null)
  const [blank, setBlank] = useState(() => !textFromHtml(initialValue))

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialValue || ''
  }, [initialValue])

  function emit() {
    const html = ref.current?.innerHTML || ''
    setBlank(!textFromHtml(html))
    onChange(html)
  }

  function exec(command) {
    ref.current?.focus()
    document.execCommand(command)
    emit()
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-panel ${invalid ? 'border-danger' : 'border-line'}`}>
      <div className="flex flex-wrap gap-1 border-b border-line px-2 py-1.5" role="toolbar" aria-label="Formatting">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.command}
              type="button"
              aria-label={tool.label}
              title={tool.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => exec(tool.command)}
              className="inline-grid size-9 cursor-pointer place-items-center rounded-lg text-muted transition duration-200 hover:bg-panel-2 hover:text-ink"
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>
      <div className="relative">
        {blank ? <span className="pointer-events-none absolute top-4 left-4 text-sm text-faint">Write your message</span> : null}
        <div
          ref={ref}
          className="editor text-[15px]"
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="Message"
          aria-invalid={invalid || undefined}
          onInput={emit}
        />
      </div>
    </div>
  )
}
