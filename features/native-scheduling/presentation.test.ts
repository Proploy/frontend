import {
  buildGoogleCalendarEventUrl,
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
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    })
    expect(formatNativeSlot(
      '2026-08-01T04:30:00Z',
      '2026-08-01T05:00:00Z',
      'Asia/Kolkata',
    )).toBe(
      `${formatter.format(new Date('2026-08-01T04:30:00Z'))} – ${formatter.format(new Date('2026-08-01T05:00:00Z'))} (Asia/Kolkata)`,
    )
  })

  describe('buildGoogleCalendarEventUrl', () => {
    it('builds a render URL with the calendar TEMPLATE action', () => {
      const url = buildGoogleCalendarEventUrl({
        title: 'Discovery call',
        startsAt: '2026-08-01T15:00:00Z',
        endsAt: '2026-08-01T15:30:00Z',
        details: 'Project kickoff',
        location: 'https://meet.google.com/abc-defg-hij',
        timezone: 'UTC',
      })
      expect(url).not.toBeNull()
      expect(url).toContain('https://calendar.google.com/calendar/render?')
      expect(url).toContain('action=TEMPLATE')
      expect(url).toContain('text=Discovery+call')
      expect(url).toContain('dates=20260801T150000Z%2F20260801T153000Z')
      expect(url).toContain('location=')
      expect(url).toContain('ctz=UTC')
    })

    it('returns null when the meeting has no start time', () => {
      expect(
        buildGoogleCalendarEventUrl({
          title: 'x',
          startsAt: '',
          endsAt: '',
        }),
      ).toBeNull()
    })

    it('keeps calendar timestamps absolute while preserving the requested display timezone', () => {
      const url = buildGoogleCalendarEventUrl({
        title: 'Kolkata discovery call',
        startsAt: '2026-08-01T15:00:00Z',
        endsAt: '2026-08-01T15:30:00Z',
        timezone: 'Asia/Kolkata',
      })

      expect(url).toContain('dates=20260801T150000Z%2F20260801T153000Z')
      expect(url).toContain('ctz=Asia%2FKolkata')
    })
  })
})
