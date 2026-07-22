/**
 * use-expert-self.ts
 * Hook for expert self-management endpoints (profile, links, projects, uploads).
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: true.
 * Discriminated union result style: { ok: true, data: T } | NormalizedError
 */

import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

const client = new ServiceApisBrowserClient()

export type PatchProfileResult = { ok: true; data: unknown } | NormalizedError
export type RestoreApplicationResult = { ok: true; data: unknown } | NormalizedError
export type AddLinkResult = { ok: true; data: unknown } | NormalizedError
export type DeleteLinkResult = { ok: true; data: unknown } | NormalizedError
export type CreateProjectResult = { ok: true; data: unknown } | NormalizedError
export type UpdateProjectResult = { ok: true; data: unknown } | NormalizedError
export type DeleteProjectResult = { ok: true; data: unknown } | NormalizedError
export type GetProfilePictureUploadUrlResult = { ok: true; data: { storageKey: string; fileName: string; fileContentType: string } } | NormalizedError
export type PatchProfilePictureResult = { ok: true; data: unknown } | NormalizedError
export type GetProjectUploadUrlResult = { ok: true; data: { storageKey: string; fileName: string; fileContentType: string } } | NormalizedError
export type UploadProfilePictureResult = { ok: true; data: unknown } | NormalizedError
export type UploadProjectFileResult = { ok: true; data: unknown } | NormalizedError

async function patchProfile(body: Record<string, unknown>): Promise<PatchProfileResult> {
  const result = await client.patch('/api/v1/experts/me/profile', body, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function restoreApplication(): Promise<RestoreApplicationResult> {
  const result = await client.post('/api/v1/experts/me/application/restore', undefined, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function addLink(linkType: string, url: string): Promise<AddLinkResult> {
  const result = await client.post('/api/v1/experts/me/links', { linkType, url }, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function deleteLink(linkId: string): Promise<DeleteLinkResult> {
  const result = await client.delete(`/api/v1/experts/me/links/${encodeURIComponent(linkId)}`, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function createProject(body: Record<string, unknown>): Promise<CreateProjectResult> {
  const result = await client.post('/api/v1/experts/me/projects', body, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function updateProject(projectId: string, body: Record<string, unknown>): Promise<UpdateProjectResult> {
  const result = await client.patch(
    `/api/v1/experts/me/projects/${encodeURIComponent(projectId)}`,
    body,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function deleteProject(projectId: string): Promise<DeleteProjectResult> {
  const result = await client.delete(`/api/v1/experts/me/projects/${encodeURIComponent(projectId)}`, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function getProfilePictureUploadUrl(
  filename: string,
  contentType = 'image/jpeg',
): Promise<GetProfilePictureUploadUrlResult> {
  const result = await client.post<{ storageKey: string; fileName: string; fileContentType: string }>(
    '/api/v1/experts/me/profile-picture-url',
    { filename, contentType },
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function patchProfilePicture(body: Record<string, unknown>): Promise<PatchProfilePictureResult> {
  const result = await client.patch('/api/v1/experts/me/profile-picture', body, { requireAuth: true })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function uploadProfilePicture(file: File): Promise<UploadProfilePictureResult> {
  const result = await client.postBinary(
    `/api/v1/experts/me/profile-picture/upload?filename=${encodeURIComponent(file.name)}`,
    file,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function getProjectUploadUrl(
  projectId: string,
  filename: string,
  contentType = 'application/pdf',
): Promise<GetProjectUploadUrlResult> {
  const result = await client.post<{ storageKey: string; fileName: string; fileContentType: string }>(
    '/api/v1/experts/me/projects/upload-url',
    { projectId, filename, contentType },
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function uploadProjectFile(projectId: string, file: File): Promise<UploadProjectFileResult> {
  const result = await client.postBinary(
    `/api/v1/experts/me/projects/${encodeURIComponent(projectId)}/file?filename=${encodeURIComponent(file.name)}`,
    file,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export function useExpertSelf() {
  return useMemo(() => ({
    patchProfile,
    restoreApplication,
    addLink,
    deleteLink,
    createProject,
    updateProject,
    deleteProject,
    getProfilePictureUploadUrl,
    uploadProfilePicture,
    patchProfilePicture,
    getProjectUploadUrl,
    uploadProjectFile,
  }), [])
}
