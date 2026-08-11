import { render } from '@/test/render'
import { RecentActivity } from '@/app/(site)/workspace/page'
import { workspaceActivityHref } from '@/features/workspace/use-workspace-home'

describe('workspace recent activity', () => {
  it('targets the exact source record', () => {
    expect(workspaceActivityHref('engagement', 'e1')).toBe('/workspace/engagements?engagement=e1')
    expect(workspaceActivityHref('proposal', 'p1')).toBe('/workspace/proposals?proposal=p1')
    expect(workspaceActivityHref('contract', 'c1')).toBe('/workspace/contracts?contract=c1')
    expect(workspaceActivityHref('invoice', 'i1')).toBe('/workspace/invoices?invoice=i1')
  })

  it('links the full activity row to its source page', async () => {
    const view = await render(
      <RecentActivity
        isLoading={false}
        items={[
          {
            id: 'proposal:p1',
            kind: 'proposal',
            title: 'Migration',
            detail: 'Proposal · Sent',
            createdAt: '2026-07-29T03:30:00Z',
            href: '/workspace/proposals?proposal=p1',
          },
        ]}
      />,
    )

    const link = view.container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/workspace/proposals?proposal=p1')
    expect(link?.textContent).toContain('Migration')
    await view.unmount()
  })
})
