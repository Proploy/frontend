import fs from 'node:fs'
import path from 'node:path'

describe('AI workspace page shell', () => {
  it('keeps the global navbar in the root layout exactly once', () => {
    const root = process.cwd()
    const pageSource = fs.readFileSync(
      path.join(root, 'app/AI_workspace/page.tsx'),
      'utf8',
    )
    const layoutSource = fs.readFileSync(
      path.join(root, 'app/layout.tsx'),
      'utf8',
    )
    const workspaceSource = fs.readFileSync(
      path.join(
        root,
        'components/ai-workspace/SoftwareProcurementWorkspace.tsx',
      ),
      'utf8',
    )
    const headerSource = fs.readFileSync(
      path.join(
        root,
        'components/ai-workspace/EvaluationHeader.tsx',
      ),
      'utf8',
    )
    const decisionSource = fs.readFileSync(
      path.join(
        root,
        'components/ai-workspace/DecisionWorkspace.tsx',
      ),
      'utf8',
    )

    expect(pageSource).not.toContain('<Navbar')
    expect(layoutSource.match(/<Navbar \/>/g)).toHaveLength(1)
    expect(workspaceSource).toContain('mt-[80px]')
    expect(workspaceSource).toContain(
      'h-[calc(100dvh-80px)]',
    )
    expect(workspaceSource).toContain(
      'transition-[grid-template-columns]',
    )
    expect(headerSource).toContain('Save evaluation')
    expect(headerSource).toContain('Share')
    expect(decisionSource).toContain(
      'key={evaluation.evaluation_id}',
    )
  })
})
