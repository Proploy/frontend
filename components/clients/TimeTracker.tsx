'use client'

import { useEffect, useState } from 'react'
import { Pause, Play, Plus, Trash2 } from 'lucide-react'
import { useClients } from '@/lib/clients/clients-store'
import { BUTTON_SKEUO } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { formatCurrency, formatDate, formatDuration, formatStopwatch, hoursToMinutes } from '@/lib/format'
import type { Project } from '@/hooks/types/clients-contracts'

const INPUT = 'bg-white border border-[#d5d7da] rounded-[8px] px-[10px] py-[9px] text-[14px] text-[#181d27] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30'

export function TimeTracker({ project }: { project: Project }) {
  const { startTimer, stopTimer, addManualEntry, deleteEntry, updateEntry } = useClients()
  const running = project.timeEntries.find((e) => e.runningStartedAt)
  const [, setTick] = useState(0)

  // Live tick while a timer is running.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const [desc, setDesc] = useState('')
  const [rate, setRate] = useState('120')

  // Manual entry form
  const [mDate, setMDate] = useState(new Date().toISOString().slice(0, 10))
  const [mHours, setMHours] = useState('')
  const [mDesc, setMDesc] = useState('')
  const [mBillable, setMBillable] = useState(true)
  const [mRate, setMRate] = useState('120')

  const liveSeconds = running?.runningStartedAt
    ? running.minutes * 60 + Math.floor((Date.now() - running.runningStartedAt) / 1000)
    : 0

  const totalMins = project.timeEntries.reduce((s, e) => s + e.minutes + (e.runningStartedAt ? Math.floor((Date.now() - e.runningStartedAt) / 60000) : 0), 0)
  const billableValue = project.timeEntries
    .filter((e) => e.billable)
    .reduce((s, e) => s + Math.round((e.minutes / 60) * e.rateCents), 0)

  const addManual = () => {
    const hrs = parseFloat(mHours)
    if (!hrs || hrs <= 0) return
    addManualEntry(project.id, {
      date: mDate,
      minutes: hoursToMinutes(hrs),
      description: mDesc.trim() || 'Work',
      billable: mBillable,
      rateCents: Math.round((parseFloat(mRate) || 0) * 100),
    })
    setMHours(''); setMDesc('')
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Timer */}
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] flex flex-wrap items-center gap-[16px]">
        {running ? (
          <>
            <div className="font-semibold text-[32px] leading-[40px] tabular-nums text-[#181d27]">{formatStopwatch(liveSeconds)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#181d27] truncate">{running.description}</p>
              <p className="text-[13px] text-[#717680]">Running · {formatCurrency(running.rateCents)}/h</p>
            </div>
            <button type="button" onClick={() => stopTimer(project.id)} className={`flex items-center gap-[6px] bg-[#f04438] border-2 border-white/[0.12] rounded-[8px] px-[16px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}>
              <Pause size={18} /> Stop
            </button>
          </>
        ) : (
          <>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What are you working on?"
              className="flex-1 min-w-[200px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] text-[14px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
            />
            <div className="flex items-center gap-[6px] text-[14px] text-[#717680]">
              $<input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-[64px] bg-white border border-[#d5d7da] rounded-[8px] px-[8px] py-[10px] text-[14px] text-right focus:outline-none focus:ring-2 focus:ring-[#155eef]/30" />/h
            </div>
            <button type="button" onClick={() => startTimer(project.id, desc, Math.round((parseFloat(rate) || 0) * 100))} className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[16px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}>
              <Play size={18} /> Start timer
            </button>
          </>
        )}
      </div>

      {/* Totals */}
      <div className="flex flex-wrap gap-[20px]">
        <Tot label="Total tracked" value={formatDuration(totalMins)} />
        <Tot label="Billable value" value={formatCurrency(billableValue)} />
        <Tot label="Entries" value={String(project.timeEntries.length)} />
      </div>

      {/* Manual add */}
      <div className="rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] flex flex-wrap items-end gap-[12px]">
        <Field label="Date"><input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} className={INPUT} /></Field>
        <Field label="Hours"><input value={mHours} onChange={(e) => setMHours(e.target.value)} inputMode="decimal" placeholder="2.5" className={`${INPUT} w-[80px]`} /></Field>
        <Field label="Description" grow><input value={mDesc} onChange={(e) => setMDesc(e.target.value)} placeholder="Description" className={`${INPUT} w-full`} /></Field>
        <Field label="Rate ($/h)"><input value={mRate} onChange={(e) => setMRate(e.target.value)} inputMode="decimal" className={`${INPUT} w-[80px]`} /></Field>
        <label className="flex items-center gap-[6px] text-[13px] text-[#414651] pb-[10px]">
          <input type="checkbox" checked={mBillable} onChange={(e) => setMBillable(e.target.checked)} className="size-[16px] accent-[#155eef]" /> Billable
        </label>
        <button type="button" onClick={addManual} className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
          <Plus size={16} /> Add entry
        </button>
      </div>

      {/* Entries table */}
      <div className="rounded-[12px] border border-[#e9eaeb] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e9eaeb] text-left">
              <Th className="pl-[16px]">Date</Th><Th>Description</Th><Th>Duration</Th><Th>Billable</Th><Th>Rate</Th><Th>Amount</Th><Th />
            </tr>
          </thead>
          <tbody>
            {project.timeEntries.length === 0 && (
              <tr><td colSpan={7} className="px-[16px] py-[32px] text-center text-[14px] text-[#717680]">No time logged yet.</td></tr>
            )}
            {project.timeEntries.map((e) => {
              const mins = e.minutes + (e.runningStartedAt ? Math.floor((Date.now() - e.runningStartedAt) / 60000) : 0)
              const amount = e.billable ? Math.round((mins / 60) * e.rateCents) : 0
              return (
                <tr key={e.id} className="border-b border-[#e9eaeb] last:border-b-0 hover:bg-[#fafafa]">
                  <td className="px-[16px] py-[12px] text-[13px] text-[#414651]">{formatDate(e.date)}</td>
                  <td className="px-[16px] py-[12px] text-[13px] text-[#181d27]">{e.description}{e.runningStartedAt && <span className="ml-[6px] text-[12px] text-[#17b26a]">● running</span>}</td>
                  <td className="px-[16px] py-[12px] text-[13px] text-[#414651] tabular-nums">{formatDuration(mins)}</td>
                  <td className="px-[16px] py-[12px]">
                    <button type="button" onClick={() => updateEntry(project.id, e.id, { billable: !e.billable })} className={`rounded-full px-[8px] py-[2px] text-[12px] font-medium ${e.billable ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#f5f5f5] text-[#717680]'}`}>
                      {e.billable ? 'Billable' : 'Non-billable'}
                    </button>
                  </td>
                  <td className="px-[16px] py-[12px] text-[13px] text-[#414651] tabular-nums">{formatCurrency(e.rateCents)}</td>
                  <td className="px-[16px] py-[12px] text-[13px] font-medium text-[#181d27] tabular-nums">{amount ? formatCurrency(amount) : '—'}</td>
                  <td className="px-[16px] py-[12px] text-right pr-[16px]">
                    <button type="button" onClick={() => deleteEntry(project.id, e.id)} aria-label="Delete" className="text-[#a4a7ae] hover:text-[#f04438]"><Trash2 size={16} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Field({ label, children, grow }: { label: string; children: React.ReactNode; grow?: boolean }) {
  return (
    <div className={`flex flex-col gap-[6px] ${grow ? 'flex-1 min-w-[160px]' : ''}`}>
      <label className="text-[13px] font-medium text-[#414651]">{label}</label>
      {children}
    </div>
  )
}
function Tot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <p className="text-[13px] font-medium text-[#717680]">{label}</p>
      <p className="mt-[2px] font-semibold text-[22px] leading-[30px] text-[#181d27] tabular-nums">{value}</p>
    </div>
  )
}
function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`font-medium text-[12px] text-[#717680] px-[16px] py-[10px] ${className}`}>{children}</th>
}
