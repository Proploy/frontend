'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useClients } from '@/lib/clients/clients-store'
import { colorFor, initials } from '@/lib/clients/clients-mock'
import { TASK_COLUMNS } from '@/hooks/types/clients-contracts'
import type { Project, TaskColumn } from '@/hooks/types/clients-contracts'

export function KanbanBoard({ project }: { project: Project }) {
  const { addTask, moveTask, updateTask, deleteTask } = useClients()
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<TaskColumn | null>(null)
  const [adding, setAdding] = useState<TaskColumn | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px]">
      {TASK_COLUMNS.map((col) => {
        const cards = project.tasks.filter((t) => t.column === col.id)
        return (
          <div
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.id) }}
            onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
            onDrop={() => { if (dragId) moveTask(project.id, dragId, col.id); setDragId(null); setOverCol(null) }}
            className={`flex flex-col gap-[10px] rounded-[12px] border p-[12px] min-h-[160px] transition-colors ${
              overCol === col.id ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-[#e9eaeb] bg-[#fafafa]'
            }`}
          >
            <div className="flex items-center justify-between px-[4px]">
              <div className="flex items-center gap-[8px]">
                <span className="size-[8px] rounded-full" style={{ background: col.color }} />
                <span className="font-semibold text-[13px] text-[#414651]">{col.label}</span>
                <span className="text-[12px] text-[#717680]">{cards.length}</span>
              </div>
              <button type="button" onClick={() => setAdding(col.id)} aria-label="Add card" className="text-[#a4a7ae] hover:text-[#155eef]">
                <Plus size={16} />
              </button>
            </div>

            {cards.map((task) => (
              <div
                key={task.id}
                draggable={editId !== task.id}
                onDragStart={() => setDragId(task.id)}
                onDragEnd={() => { setDragId(null); setOverCol(null) }}
                className={`group rounded-[10px] border border-[#e9eaeb] bg-white p-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] ${
                  dragId === task.id ? 'opacity-50' : ''
                } cursor-grab active:cursor-grabbing`}
              >
                <div className="flex items-start justify-between gap-[8px]">
                  {editId === task.id ? (
                    <input
                      autoFocus
                      defaultValue={task.title}
                      onBlur={(e) => { updateTask(project.id, task.id, { title: e.target.value.trim() || task.title }); setEditId(null) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { updateTask(project.id, task.id, { title: (e.target as HTMLInputElement).value.trim() || task.title }); setEditId(null) }
                        if (e.key === 'Escape') setEditId(null)
                      }}
                      className="flex-1 border border-[#155eef] rounded-[6px] px-[6px] py-[3px] text-[13px] focus:outline-none"
                    />
                  ) : (
                    <button type="button" onClick={() => setEditId(task.id)} className="flex-1 text-left text-[13px] leading-[18px] text-[#181d27]">
                      {task.title}
                    </button>
                  )}
                  <button type="button" onClick={() => deleteTask(project.id, task.id)} aria-label="Delete" className="opacity-0 group-hover:opacity-100 text-[#a4a7ae] hover:text-[#f04438] shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <div className="mt-[10px] flex items-center justify-between">
                  {task.assignee ? (
                    <span className="size-[22px] rounded-full flex items-center justify-center text-white font-semibold text-[9px]" style={{ background: colorFor(task.assignee) }} title={task.assignee}>
                      {initials(task.assignee)}
                    </span>
                  ) : <span />}
                  {task.estimateHours != null && (
                    <span className="text-[12px] text-[#717680]">{task.estimateHours}h</span>
                  )}
                </div>
              </div>
            ))}

            {adding === col.id ? (
              <input
                autoFocus
                placeholder="Card title…"
                onBlur={(e) => { const v = e.target.value.trim(); if (v) addTask(project.id, col.id, v); setAdding(null) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) addTask(project.id, col.id, v); setAdding(null) }
                  if (e.key === 'Escape') setAdding(null)
                }}
                className="rounded-[8px] border border-[#155eef] bg-white px-[10px] py-[8px] text-[13px] focus:outline-none"
              />
            ) : (
              <button type="button" onClick={() => setAdding(col.id)} className="flex items-center gap-[6px] rounded-[8px] px-[8px] py-[6px] text-[13px] text-[#717680] hover:bg-white hover:text-[#414651]">
                <Plus size={14} /> Add card
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
