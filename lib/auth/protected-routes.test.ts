import { describe, expect, it } from 'vitest'
import { isProtectedRoute } from './protected-routes'

describe('isProtectedRoute', () => {
  it.each([
    '/workspace',
    '/workspace/projects',
    '/dashboard',
    '/profile',
    '/become-expert',
    '/AI_workspace',
    '/experts/abc123',
    '/experts/dashboard',
  ])('protects %s', path => {
    expect(isProtectedRoute(path)).toBe(true)
  })

  it.each([
    '/',
    '/products',
    '/product/6c51b28e08b6',
    '/compare',
    '/experts',
    '/experts/top',
    '/sign-in',
    '/contact',
  ])('leaves %s public', path => {
    expect(isProtectedRoute(path)).toBe(false)
  })
})
