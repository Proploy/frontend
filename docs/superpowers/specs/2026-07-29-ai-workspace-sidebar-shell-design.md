# AI Workspace Sidebar Shell Design

## Goal

Make `/AI_workspace` use the same page orientation as the existing workspace:
a full-height left sidebar that owns the Proploy logo and collapse control,
with the working area filling the rest of the viewport.

The existing `/workspace` shell and its behavior must remain unchanged.

## Route Chrome

- Add `/AI_workspace` to the routes that suppress the global marketing navbar.
- Remove the AI workspace's current 80-pixel top offset.
- Size loading, signed-out, empty, and active states to the full dynamic
  viewport height.
- Keep the evaluation content and decision workspace within the existing
  responsive grid.

## Evaluation Sidebar

- Add a top brand row to the desktop evaluation sidebar.
- Show the existing Proploy SVG wordmark while expanded.
- Keep the existing collapse button in the brand row.
- When collapsed, match the workspace convention by hiding the wordmark and
  retaining the expand control.
- Preserve evaluation grouping, selection, item menus, scrolling, and the
  bottom “New evaluation” action.
- In the mobile drawer, show the wordmark with the existing close action
  instead of a desktop collapse action.

## Responsive Behavior

- Desktop: the evaluation sidebar spans the complete viewport height and
  transitions between its existing expanded and collapsed widths.
- Mobile: the sidebar remains an overlay drawer; the evaluation header keeps
  the button that opens it.
- The right decision workspace keeps its independent collapse/drawer behavior.

## Isolation

- Do not modify `WorkspaceShell`, workspace navigation, workspace sidebar
  sizing, workspace notifications, or workspace collapse behavior.
- Shared brand assets may be reused, but the new layout behavior stays inside
  the AI workspace components and the global navbar's route-suppression list.

## Verification

- Add tests that assert `/AI_workspace` suppresses the global navbar and uses a
  full-height shell without the old top offset.
- Add sidebar tests for expanded wordmark and collapsed label behavior.
- Run the AI workspace component tests, changed-file lint, the complete
  frontend test suite, and a production build.
