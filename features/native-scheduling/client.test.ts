import {
  buildNativeAvailabilityPath,
  buildNativeRequestActionPath,
} from '@/features/native-scheduling/client'

describe('native scheduling API paths', () => {
  it('encodes engagement availability query parameters', () => {
    expect(
      buildNativeAvailabilityPath(
        'engagement/1',
        '2026-08-01T00:00:00Z',
        '2026-08-08T00:00:00Z',
        'Asia/Kolkata',
      ),
    ).toBe(
      '/api/v1/native-scheduling/engagements/engagement%2F1/availability?fromAt=2026-08-01T00%3A00%3A00Z&toAt=2026-08-08T00%3A00%3A00Z&viewerTimezone=Asia%2FKolkata',
    )
  })

  it('builds the locked booking-request actions', () => {
    expect(buildNativeRequestActionPath('request/1', 'accept')).toBe(
      '/api/v1/native-scheduling/booking-requests/request%2F1/accept',
    )
    expect(buildNativeRequestActionPath('request/1', 'propose-alternative')).toBe(
      '/api/v1/native-scheduling/booking-requests/request%2F1/propose-alternative',
    )
  })
})
