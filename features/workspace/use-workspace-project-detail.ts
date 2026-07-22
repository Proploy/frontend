'use client'

/**
 * Workspace project detail — persisted milestones, sub-items, and time entries.
 *
 * Backend endpoints (service-apis workspace.project router):
 *   GET    /api/v1/workspace/projects/{id}/milestones
 *   POST   /api/v1/workspace/projects/{id}/milestones
 *   PATCH  /api/v1/workspace/milestones/{id}
 *   POST   /api/v1/workspace/milestones/{id}/complete
 *   GET    /api/v1/workspace/projects/{id}/sub-items
 *   POST   /api/v1/workspace/projects/{id}/sub-items
 *   PATCH  /api/v1/workspace/sub-items/{id}
 *   POST   /api/v1/workspace/sub-items/{id}/complete
 *   POST   /api/v1/workspace/time-entries/start
 *   POST   /api/v1/workspace/time-entries/{id}/stop
 *   GET    /api/v1/workspace/time-entries/active
 *   GET    /api/v1/workspace/projects/{id}/time-entries
 *   GET    /api/v1/workspace/projects/{id}/time-summary
 *
 * This hook is the browser boundary for the service-API workspace routes.
 */

import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

const client = new ServiceApisBrowserClient()
const WORKSPACE_ROOT = '/api/v1/workspace'

export type MilestoneStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'
export type SubItemStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'

export interface Milestone {
  id: string
  projectId: string
  title: string
  summary?: string | null
  dueAt?: string | null
  status: MilestoneStatus
  buyerAcceptedAt?: string | null
  expertAcceptedAt?: string | null
  buyerDeclinedAt?: string | null
  expertDeclinedAt?: string | null
  acceptances: MilestoneAcceptance[]
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

export interface MilestoneAcceptance {
  milestoneId: string
  userId: string
  decision: 'accepted' | 'declined'
  note?: string | null
  createdAt: string
}

export interface ProjectSubItem {
  id: string
  parentSubitemId?: string | null
  projectId: string
  milestoneId?: string | null
  title: string
  description?: string | null
  status: SubItemStatus
  sortOrder: number
  createdByUserId: string
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

export interface TimeEntry {
  id: string
  projectId: string
  subitemId?: string | null
  milestoneId?: string | null
  userId: string
  startedAt: string
  endedAt?: string | null
  durationMinutes?: number | null
  note?: string | null
  createdAt: string
  updatedAt: string
}

export interface TimeSummary {
  projectId: string
  totalMinutes: number
  entryCount: number
  bySubitem: Record<string, number>
}

export interface MilestoneCreateInput {
  title: string
  summary?: string
  dueAt?: string
}

export interface MilestoneDecisionInput {
  decision: 'accept' | 'decline'
  note?: string
}

export interface MilestoneUpdateInput {
  title?: string
  summary?: string | null
  dueAt?: string | null
  status?: MilestoneStatus
}

export interface SubItemCreateInput {
  title: string
  description?: string
  parentSubitemId?: string
  milestoneId?: string
}

export interface SubItemUpdateInput {
  title?: string
  description?: string
  status?: SubItemStatus
  milestoneId?: string
}

export interface SubItemReorderInput {
  items: Array<{ id: string; status: SubItemStatus }>
}

export interface StartTimerInput {
  projectId: string
  subitemId?: string
  milestoneId?: string
  note?: string
}

type ApiResult<T> = { ok: true; data: T } | NormalizedError

async function authedGet<T>(path: string): Promise<ApiResult<T>> {
  return client.get<T>(`${WORKSPACE_ROOT}${path}`, { requireAuth: true })
}

async function authedPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  return client.post<T>(`${WORKSPACE_ROOT}${path}`, body, { requireAuth: true })
}

async function authedPatch<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  return client.patch<T>(`${WORKSPACE_ROOT}${path}`, body, { requireAuth: true })
}

// ─── Milestones ───────────────────────────────────────────────────────────────

export async function listMilestones(
  projectId: string,
): Promise<ApiResult<{ milestones: Milestone[] }>> {
  return authedGet<{ milestones: Milestone[] }>(
    `/projects/${encodeURIComponent(projectId)}/milestones`,
  )
}

export async function addMilestone(
  projectId: string,
  input: MilestoneCreateInput,
): Promise<ApiResult<Milestone>> {
  return authedPost<Milestone>(
    `/projects/${encodeURIComponent(projectId)}/milestones`,
    input,
  )
}

export async function completeMilestone(
  milestoneId: string,
): Promise<ApiResult<Milestone>> {
  return authedPost<Milestone>(
    `/milestones/${encodeURIComponent(milestoneId)}/complete`,
    undefined,
  )
}

export async function decideMilestone(
  milestoneId: string,
  input: MilestoneDecisionInput,
): Promise<ApiResult<Milestone>> {
  return authedPost<Milestone>(
    `/milestones/${encodeURIComponent(milestoneId)}/decision`,
    input,
  )
}

export async function updateMilestone(
  milestoneId: string,
  input: MilestoneUpdateInput,
): Promise<ApiResult<Milestone>> {
  return authedPatch<Milestone>(
    `/milestones/${encodeURIComponent(milestoneId)}`,
    input,
  )
}

// ─── Sub-items ────────────────────────────────────────────────────────────────

export async function listSubItems(
  projectId: string,
): Promise<ApiResult<{ subitems: ProjectSubItem[] }>> {
  return authedGet<{ subitems: ProjectSubItem[] }>(
    `/projects/${encodeURIComponent(projectId)}/sub-items`,
  )
}

export async function addSubItem(
  projectId: string,
  input: SubItemCreateInput,
): Promise<ApiResult<ProjectSubItem>> {
  return authedPost<ProjectSubItem>(
    `/projects/${encodeURIComponent(projectId)}/sub-items`,
    input,
  )
}

export async function updateSubItem(
  subitemId: string,
  input: SubItemUpdateInput,
): Promise<ApiResult<ProjectSubItem>> {
  return authedPatch<ProjectSubItem>(
    `/sub-items/${encodeURIComponent(subitemId)}`,
    input,
  )
}

export async function reorderSubItems(
  projectId: string,
  input: SubItemReorderInput,
): Promise<ApiResult<{ subitems: ProjectSubItem[] }>> {
  return authedPatch<{ subitems: ProjectSubItem[] }>(
    `/projects/${encodeURIComponent(projectId)}/sub-items/reorder`,
    input,
  )
}

// ─── Time entries ─────────────────────────────────────────────────────────────

export async function listTimeEntries(
  projectId: string,
): Promise<ApiResult<{ entries: TimeEntry[] }>> {
  return authedGet<{ entries: TimeEntry[] }>(
    `/projects/${encodeURIComponent(projectId)}/time-entries`,
  )
}

export async function summarizeTime(
  projectId: string,
): Promise<ApiResult<TimeSummary>> {
  return authedGet<TimeSummary>(
    `/projects/${encodeURIComponent(projectId)}/time-summary`,
  )
}

export async function startTimer(
  input: StartTimerInput,
): Promise<ApiResult<TimeEntry>> {
  return authedPost<TimeEntry>('/time-entries/start', input)
}

export async function stopTimer(entryId: string): Promise<ApiResult<TimeEntry>> {
  return authedPost<TimeEntry>(
    `/time-entries/${encodeURIComponent(entryId)}/stop`,
    {},
  )
}

/**
 * Convenience hook exposing all W3 endpoints for a single project.
 * Returns stable references to the call functions — components manage
 * their own loading/error state.
 */
export function useWorkspaceProjectDetail() {
  return useMemo(
    () => ({
      listMilestones,
      addMilestone,
      decideMilestone,
      updateMilestone,
      completeMilestone,
      listSubItems,
      addSubItem,
      updateSubItem,
      reorderSubItems,
      listTimeEntries,
      summarizeTime,
      startTimer,
      stopTimer,
    }),
    [],
  )
}
