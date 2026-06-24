// Renders a name as a script-style signature on an offscreen canvas and returns
// a PNG data URL. Used by SignaturePad's "Type" mode and to materialize seeded
// signatures (stored as `typed:Name`) into real image data on first mount, so
// the same PNG flows into the PDF/DOCX export. Browser-only (uses canvas).

export function renderTypedSignature(name: string, width = 600, height = 160): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#181d27'
  ctx.textBaseline = 'middle'
  ctx.font = 'italic 600 44px cursive'
  ctx.fillText(name, 24, height / 2)
  return canvas.toDataURL('image/png')
}

export const TYPED_PREFIX = 'typed:'
