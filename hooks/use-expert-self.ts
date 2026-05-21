// use-expert-self.ts
// Hook for expert self-management endpoints (PATCH profile, links, projects, uploads).
// All operations go through Next proxies under /api/experts/me/*.

import { useCallback } from 'react'

interface ProfilePatch {
  displayName?: string | null
  headline?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  [k: string]: unknown
}

interface ProjectInput {
  title: string
  summary: string
  outcomes: string
  link?: string | null
  fileUrl?: string | null
  [k: string]: unknown
}

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(path, { credentials: 'include', ...init })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return (json?.data ?? json) as T
}

export function useExpertSelf() {
  const patchProfile = useCallback((body: ProfilePatch) =>
    call('/api/experts/me/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  [])

  const restoreApplication = useCallback(() =>
    call('/api/experts/me/application/restore', { method: 'POST' }),
  [])

  const addLink = useCallback((linkType: string, url: string) =>
    call('/api/experts/me/links', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ linkType, url }),
    }),
  [])

  const deleteLink = useCallback((linkId: string) =>
    call(`/api/experts/me/links/${encodeURIComponent(linkId)}`, { method: 'DELETE' }),
  [])

  const createProject = useCallback((body: ProjectInput) =>
    call('/api/experts/me/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  [])

  const updateProject = useCallback((projectId: string, body: ProjectInput) =>
    call(`/api/experts/me/projects/${encodeURIComponent(projectId)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  [])

  const deleteProject = useCallback((projectId: string) =>
    call(`/api/experts/me/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' }),
  [])

  const getProfilePictureUploadUrl = useCallback(
    (filename: string, content_type = 'image/jpeg') =>
      call<{ url: string; key: string }>('/api/experts/me/profile-picture-url', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ filename, content_type }),
      }),
    [],
  )

  const patchProfilePicture = useCallback((body: { profilePictureUrl?: string | null }) =>
    call('/api/experts/me/profile-picture', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  [])

  const getProjectUploadUrl = useCallback(
    (projectId: string, filename: string, content_type = 'application/pdf') =>
      call<{ url: string; key: string }>('/api/experts/me/projects/upload-url', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId, filename, content_type }),
      }),
    [],
  )

  return {
    patchProfile,
    restoreApplication,
    addLink,
    deleteLink,
    createProject,
    updateProject,
    deleteProject,
    getProfilePictureUploadUrl,
    patchProfilePicture,
    getProjectUploadUrl,
  }
}
