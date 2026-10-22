const ALLOWED = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'DIV', 'BLOCKQUOTE', 'A', 'SPAN'])

function clean(node) {
  ;[...node.childNodes].forEach((child) => {
    if (child.nodeType !== 1) return
    clean(child)
    if (!ALLOWED.has(child.tagName)) {
      child.replaceWith(...child.childNodes)
      return
    }
    ;[...child.attributes].forEach((attr) => {
      const keepLink = child.tagName === 'A' && attr.name === 'href' && /^(https?:|mailto:)/i.test(attr.value)
      if (!keepLink) child.removeAttribute(attr.name)
    })
    if (child.tagName === 'A') {
      child.setAttribute('target', '_blank')
      child.setAttribute('rel', 'noreferrer')
    }
  })
}

export function sanitizeHtml(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) return ''
  clean(root)
  return root.innerHTML
}
