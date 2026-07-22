import {
  formatNativeSlot,
  nativeMeetingStatusLabel,
  nativeRequestStatusLabel,
} from '@/features/native-scheduling/presentation'

describe('native scheduling presentation helpers', () => {
  it('labels the locked request and meeting lifecycle states', () => {
    expect(nativeRequestStatusLabel('pending_expert')).toBe('Waiting for expert')
    expect(nativeRequestStatusLabel('conflict')).toBe('Slot became unavailable')
    expect(nativeMeetingStatusLabel('no_show')).toBe('No Show')
  })

  it('formats a slot in the requested timezone', () => {
    expect(formatNativeSlot(
      '2026-08-01T04:30:00Z',
      '2026-08-01T05:00:00Z',
      'Asia/Kolkata',
    )).toContain('Aug 1, 2026')
  })
})
