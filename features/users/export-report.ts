import type { SavedAiReportInput } from './types'

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportAiReport(report: SavedAiReportInput, filename = 'proploy-research-report.json') {
  downloadFile(filename, JSON.stringify(report, null, 2), 'application/json')
}
