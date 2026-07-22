import {
  addFavorite,
  deleteUserProfilePicture,
  getPersonalizationProfile,
  getUserProfilePicture,
  listRecentlyViewed,
  notifyUserProfilePictureChanged,
  saveAiReport,
  trackRecentlyViewed,
  uploadUserProfilePicture,
  USER_PROFILE_PICTURE_CHANGED_EVENT,
} from '../client'

const { deleteMock, getBinaryMock, getMock, postBinaryMock, postMock } = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  getBinaryMock: vi.fn(),
  getMock: vi.fn(),
  postBinaryMock: vi.fn(),
  postMock: vi.fn(),
}))

vi.mock('@/lib/service-apis/browser', () => ({
  ServiceApisBrowserClient: vi.fn(function ServiceApisBrowserClientMock() {
    return {
      get: getMock,
      getBinary: getBinaryMock,
      post: postMock,
      postBinary: postBinaryMock,
      patch: vi.fn(),
      delete: deleteMock,
    }
  }),
}))

describe('personalization service client', () => {
  beforeEach(() => {
    deleteMock.mockReset()
    getBinaryMock.mockReset()
    getMock.mockReset()
    postBinaryMock.mockReset()
    postMock.mockReset()
  })

  it('uses the canonical authenticated favorites route', async () => {
    postMock.mockResolvedValueOnce({ ok: true, data: { id: 'fav-1' } })

    await addFavorite({ targetType: 'product', targetId: 'product-1' })

    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/users/favorites',
      { targetType: 'product', targetId: 'product-1' },
      { requireAuth: true },
    )
  })

  it('loads the aggregate profile and saves reports through service-apis', async () => {
    getMock.mockResolvedValueOnce({ ok: true, data: { favorites: [], reports: [] } })
    postMock.mockResolvedValueOnce({ ok: true, data: { id: 'report-1' } })

    await getPersonalizationProfile()
    await saveAiReport({
      sessionId: 'internal-session-id',
      title: 'CRM shortlist',
      profile: { team_size: 50 },
      recommendations: [{ product_id: 'product-1' }],
    })

    expect(getMock).toHaveBeenCalledWith('/api/v1/users/me/profile', { requireAuth: true })
    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/users/me/reports',
      expect.objectContaining({
        sessionId: 'internal-session-id',
        title: 'CRM shortlist',
      }),
      { requireAuth: true },
    )
  })

  it('uses the canonical recently-viewed service-apis routes', async () => {
    getMock.mockResolvedValueOnce({ ok: true, data: [] })
    postMock.mockResolvedValueOnce({ ok: true, data: { id: 'view-1' } })

    await listRecentlyViewed()
    await trackRecentlyViewed({ targetType: 'product', targetId: 'product-1' })

    expect(getMock).toHaveBeenCalledWith('/api/v1/users/recently-viewed', { requireAuth: true })
    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/users/recently-viewed',
      { targetType: 'product', targetId: 'product-1' },
      { requireAuth: true },
    )
  })

  it('uploads, downloads, and removes profile pictures through authenticated service-apis routes', async () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    const blob = new Blob(['avatar'], { type: 'image/png' })
    postBinaryMock.mockResolvedValueOnce({ ok: true, data: { profilePictureKey: 'profile-pictures/user-1/avatar.png' } })
    getBinaryMock.mockResolvedValueOnce({ ok: true, data: blob })
    deleteMock.mockResolvedValueOnce({ ok: true, data: { profilePictureKey: null } })

    await uploadUserProfilePicture(file)
    await getUserProfilePicture()
    await deleteUserProfilePicture()

    expect(postBinaryMock).toHaveBeenCalledWith(
      '/api/v1/users/me/profile-picture/upload?filename=avatar.png',
      file,
      { requireAuth: true },
    )
    expect(getBinaryMock).toHaveBeenCalledWith('/api/v1/users/me/profile-picture', { requireAuth: true })
    expect(deleteMock).toHaveBeenCalledWith('/api/v1/users/me/profile-picture', { requireAuth: true })
  })

  it('announces profile picture changes so shared navigation avatars can refresh', () => {
    const listener = vi.fn()
    window.addEventListener(USER_PROFILE_PICTURE_CHANGED_EVENT, listener)

    notifyUserProfilePictureChanged()

    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(USER_PROFILE_PICTURE_CHANGED_EVENT, listener)
  })
})
