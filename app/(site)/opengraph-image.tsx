import { ImageResponse } from 'next/og'

// The share card for every public page that does not ship its own. Rendered
// once at build and cached; `next/og` ships with Next, so nothing is added.
export const alt = 'Proploy — Software marketplace with implementation experts'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0b1020',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '9999px', background: '#155eef' }} />
          <div style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em' }}>Proploy</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '68px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            The right software, and the experts who deploy it.
          </div>
          <div style={{ fontSize: '30px', color: '#a4acc4' }}>
            Pre-negotiated pricing · Full spend visibility · Guaranteed execution
          </div>
        </div>
      </div>
    ),
    size,
  )
}
