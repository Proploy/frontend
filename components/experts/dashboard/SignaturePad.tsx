'use client'

import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser, PencilLine, Type, UploadCloud } from 'lucide-react'
import { BUTTON_SKEUO } from './ExpertDashboardFrame'

type Mode = 'draw' | 'type' | 'upload'

const TABS: { id: Mode; label: string; icon: typeof PencilLine }[] = [
  { id: 'draw', label: 'Draw', icon: PencilLine },
  { id: 'type', label: 'Type', icon: Type },
  { id: 'upload', label: 'Upload', icon: UploadCloud },
]

/**
 * Signature capture with three modes: draw (canvas, mouse + touch), type (name
 * rendered in a script style), or upload (image of an existing signature).
 * Calls onSave with a base64 PNG data URL + the signer's full name. The PNG is
 * embedded directly into the generated PDF/DOCX contract.
 */
export function SignaturePad({
  defaultName = '',
  onSave,
  onCancel,
}: {
  defaultName?: string
  onSave: (sig: { dataUrl: string; signedName: string }) => void
  onCancel?: () => void
}) {
  const [mode, setMode] = useState<Mode>('draw')
  const [name, setName] = useState(defaultName)
  const [drawn, setDrawn] = useState(false)
  const [uploaded, setUploaded] = useState<string | null>(null)
  const padRef = useRef<SignatureCanvas | null>(null)
  const typeCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Render the typed name onto the preview canvas whenever it changes.
  useEffect(() => {
    if (mode !== 'type') return
    const canvas = typeCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!name.trim()) return
    ctx.fillStyle = '#181d27'
    ctx.textBaseline = 'middle'
    ctx.font = "italic 600 44px cursive"
    ctx.fillText(name, 24, canvas.height / 2)
  }, [name, mode])

  const handleSave = () => {
    if (!name.trim()) return
    let dataUrl = ''
    if (mode === 'draw') {
      if (!padRef.current || padRef.current.isEmpty()) return
      dataUrl = padRef.current.getCanvas().toDataURL('image/png')
    } else if (mode === 'type') {
      const canvas = typeCanvasRef.current
      if (!canvas) return
      dataUrl = canvas.toDataURL('image/png')
    } else {
      if (!uploaded) return
      dataUrl = uploaded
    }
    onSave({ dataUrl, signedName: name.trim() })
  }

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploaded(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(file)
  }

  const clearDrawing = () => {
    padRef.current?.clear()
    setDrawn(false)
  }

  const canSave =
    name.trim() !== '' &&
    ((mode === 'draw' && drawn) || (mode === 'type' && name.trim() !== '') || (mode === 'upload' && !!uploaded))

  return (
    <div className="flex flex-col gap-[16px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px]">
      {/* mode tabs */}
      <div className="flex gap-[4px] rounded-[8px] bg-[#fafafa] p-[4px]">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = mode === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              className={`flex flex-1 items-center justify-center gap-[6px] rounded-[6px] px-[12px] py-[8px] text-[14px] font-semibold leading-[20px] transition-colors ${
                active ? `bg-white text-[#181d27] ${BUTTON_SKEUO}` : 'text-[#535862] hover:text-[#181d27]'
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* signer name */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium leading-[20px] text-[#414651]">Full legal name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jordan Avery"
          className={`w-full rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
        />
      </div>

      {/* capture surface */}
      {mode === 'draw' && (
        <div className="flex flex-col gap-[8px]">
          <div className="relative overflow-hidden rounded-[10px] border border-[#d5d7da] bg-[#fafafa]">
            <SignatureCanvas
              ref={padRef}
              penColor="#181d27"
              onEnd={() => setDrawn(true)}
              canvasProps={{ className: 'w-full h-[160px] touch-none', width: 600, height: 160 }}
            />
            <span className="pointer-events-none absolute bottom-[10px] left-[24px] right-[24px] border-t border-dashed border-[#d5d7da]" />
          </div>
          <button
            type="button"
            onClick={clearDrawing}
            className="flex items-center gap-[6px] self-start text-[14px] font-medium text-[#535862] hover:text-[#181d27]"
          >
            <Eraser size={15} /> Clear
          </button>
        </div>
      )}

      {mode === 'type' && (
        <div className="overflow-hidden rounded-[10px] border border-[#d5d7da] bg-[#fafafa]">
          <canvas ref={typeCanvasRef} width={600} height={160} className="h-[160px] w-full" />
        </div>
      )}

      {mode === 'upload' && (
        <label className="flex h-[160px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[10px] border border-dashed border-[#d5d7da] bg-[#fafafa] text-center hover:border-[#155eef]">
          {uploaded ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={uploaded} alt="Uploaded signature" className="max-h-[120px] max-w-[80%] object-contain" />
          ) : (
            <>
              <UploadCloud size={22} className="text-[#155eef]" />
              <span className="text-[14px] leading-[20px] text-[#414651]">
                <span className="font-semibold text-[#155eef]">Upload</span> a signature image (PNG/JPG)
              </span>
            </>
          )}
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onUpload} />
        </label>
      )}

      <div className="flex items-center justify-end gap-[10px]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-opacity ${BUTTON_SKEUO} ${
            canSave ? 'hover:bg-[#004eeb]' : 'cursor-not-allowed opacity-50'
          }`}
        >
          Apply signature
        </button>
      </div>
    </div>
  )
}
