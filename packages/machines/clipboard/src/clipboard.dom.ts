import { createScope, getWindow } from "@zag-js/dom-query"
import { hasProp } from "@zag-js/utils"
import type { MachineContext as Ctx } from "./clipboard.types"

export const dom = createScope({
  getRootId: (ctx: Ctx) => `clip-${ctx.id}`,
  getInputId: (ctx: Ctx) => `clip-input-${ctx.id}`,
  getLabelId: (ctx: Ctx) => `clip-label-${ctx.id}`,
  getInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),
  writeToClipboard: (ctx: Ctx) => copyText(dom.getDoc(ctx), ctx.value),
})

function createNode(doc: Document, text: string): HTMLElement {
  const node = doc.createElement("pre")
  Object.assign(node.style, {
    width: "1px",
    height: "1px",
    position: "fixed",
    top: "5px",
  })
  node.textContent = text
  return node
}

function copyNode(node: HTMLElement): Promise<void> {
  const win = getWindow(node)

  const selection = win.getSelection()

  if (selection == null) {
    return Promise.reject(new Error())
  }

  selection.removeAllRanges()

  const doc = node.ownerDocument

  const range = doc.createRange()
  range.selectNodeContents(node)
  selection.addRange(range)

  doc.execCommand("copy")
  selection.removeAllRanges()

  return Promise.resolve()
}

function copyText(doc: Document, text: string): Promise<void> {
  const win = doc.defaultView || window

  if (hasProp(win.navigator, "clipboard")) {
    return win.navigator.clipboard.writeText(text)
  }

  if (!doc.body) {
    return Promise.reject(new Error())
  }

  const node = createNode(doc, text)

  doc.body.appendChild(node)
  copyNode(node)
  doc.body.removeChild(node)

  return Promise.resolve()
}
