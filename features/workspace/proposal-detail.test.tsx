import { ProposalDetail } from '@/app/workspace/proposals/page'
import { render } from '@/test/render'
import type { WorkspaceProposal } from '@/features/workspace/home-types'

const base: WorkspaceProposal = {
  id: 'p1',
  engagementId: 'e1',
  createdByUserId: 'expert-1',
  title: 'First project',
  summary: 'First summary',
  scope: 'First scope',
  budgetCents: 10000,
  validUntil: '2026-08-01T23:59:59',
  status: 'draft',
  createdAt: '2026-07-29T00:00:00Z',
  updatedAt: '2026-07-29T00:00:00Z',
}

const callbacks = {
  onUpdate: () => undefined,
  onSubmit: () => undefined,
  onAccept: () => undefined,
  onDecline: () => undefined,
  onWithdraw: () => undefined,
}

describe('proposal editor', () => {
  it('reinitializes every field when the selected proposal changes', async () => {
    const view = await render(
      <ProposalDetail
        key={base.id}
        proposal={base}
        busy={false}
        canManage
        canDecide={false}
        viewerRole="expert"
        {...callbacks}
      />,
    )

    const second = {
      ...base,
      id: 'p2',
      title: 'Second project',
      summary: 'Second summary',
      scope: 'Second scope',
      budgetCents: 25000,
      validUntil: '2026-09-15T23:59:59',
    }
    await view.rerender(
      <ProposalDetail
        key={second.id}
        proposal={second}
        busy={false}
        canManage
        canDecide={false}
        viewerRole="expert"
        {...callbacks}
      />,
    )

    const values = Array.from(
      view.container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input, textarea',
      ),
      (field) => field.value,
    )
    expect(values).toEqual([
      'Second project',
      '250',
      '2026-09-15',
      'Second summary',
      'Second scope',
    ])
    await view.unmount()
  })
})
