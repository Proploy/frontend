import fs from 'node:fs'
import path from 'node:path'

describe('AI workspace page shell', () => {
  it('suppresses the global navbar and fills the viewport with its own shell', () => {
    const root = process.cwd()
    const pageSource = fs.readFileSync(
      path.join(root, 'app/(site)/AI_workspace/page.tsx'),
      'utf8',
    )
    const layoutSource = fs.readFileSync(
      path.join(root, 'app/(site)/layout.tsx'),
      'utf8',
    )
    const navbarSource = fs.readFileSync(
      path.join(root, 'components/Navbar.tsx'),
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
    expect(navbarSource).toContain('"/AI_workspace"')
    expect(workspaceSource).toContain('h-dvh')
    expect(workspaceSource).not.toContain('mt-[80px]')
    expect(workspaceSource).not.toContain('h-[calc(100dvh-80px)]')
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
