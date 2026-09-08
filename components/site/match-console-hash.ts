/**
 * Anchor for the homepage match engine.
 *
 * Kept in its own module so the nav flyout can link to `/#…` without pulling
 * the client-only MatchConsole into its bundle, and so the two can never drift
 * apart into a silently dead anchor.
 */
export const MATCH_CONSOLE_HASH = 'match-engine'
