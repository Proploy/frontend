'use client'

// Dotted world-reach graphic — pure CSS grid dots, no map tiles or
// third-party scripts. Ported from the artifact's #feDots script: the same
// COLS/ROWS, shape bitmap and hot coordinates, rendered as React spans.
const COLS = 22
const ROWS = 11

const SHAPE = [
  '0001111000000000000000',
  '0011111110000011100000',
  '0001111110000111111000',
  '0000111100001111111100',
  '0000011000011111111000',
  '0000011100001111110000',
  '0000011110000111111100',
  '0000011100000111111100',
  '0000001100000011111000',
  '0000000000000011100110',
  '0000000000000000000110',
]

const HOT: Array<[number, number]> = [
  [1, 4],
  [2, 5],
  [3, 15],
  [4, 16],
  [5, 12],
  [6, 17],
  [7, 10],
  [2, 16],
  [8, 18],
  [9, 20],
]

const isHot = (r: number, c: number) => HOT.some(([hr, hc]) => hr === r && hc === c)

export function FeDots() {
  const dots: React.ReactNode[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const on = SHAPE[r][c] === '1'
      const cls = on ? (isHot(r, c) ? 'fe-dot hot' : 'fe-dot on') : 'fe-dot'
      dots.push(<span key={`${r}-${c}`} className={cls} />)
    }
  }
  return (
    <div className="fe-dots" aria-hidden="true">
      {dots}
    </div>
  )
}
