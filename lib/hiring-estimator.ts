// Shared, transparent implementation cost & timeline model.
// Consumed by the public /hiring-calculator marketing page and the
// business dashboard hiring estimator. The model is deliberately simple:
// a category base, a scope multiplier, and a timeline factor.

import { Database, Gauge, LineChart, Plug, Users } from 'lucide-react'
import type { ComponentType } from 'react'

export interface CategoryConfig {
  id: string
  label: string
  /** Baseline mid-point fee for a medium-scope rollout, in USD. */
  base: number
  /** Baseline weeks-to-live for a medium-scope rollout. */
  baseWeeks: number
  icon: ComponentType<{ size?: number; className?: string }>
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'crm', label: 'CRM (Salesforce, HubSpot)', base: 48000, baseWeeks: 10, icon: Users },
  { id: 'erp', label: 'ERP (NetSuite, SAP, Dynamics)', base: 120000, baseWeeks: 22, icon: Database },
  { id: 'data', label: 'Data & analytics (Snowflake, dbt)', base: 64000, baseWeeks: 12, icon: LineChart },
  { id: 'itsm', label: 'ITSM / workflow (ServiceNow)', base: 72000, baseWeeks: 14, icon: Gauge },
  { id: 'integration', label: 'Integration / iPaaS (Workato, MuleSoft)', base: 40000, baseWeeks: 8, icon: Plug },
]

export interface ScopeConfig {
  id: string
  label: string
  blurb: string
  /** Cost + duration multiplier vs. the medium baseline. */
  factor: number
}

export const SCOPES: ScopeConfig[] = [
  { id: 'pilot', label: 'Pilot / single team', blurb: 'One workflow, ~25 users', factor: 0.45 },
  { id: 'standard', label: 'Standard rollout', blurb: 'One department, ~150 users', factor: 1 },
  { id: 'multi', label: 'Multi-department', blurb: 'Several teams, ~500 users', factor: 1.8 },
  { id: 'enterprise', label: 'Enterprise program', blurb: 'Org-wide, 1,000+ users', factor: 3.1 },
]

export interface TimelineConfig {
  id: string
  label: string
  blurb: string
  /** Cost factor — speed carries a premium. */
  costFactor: number
  /** Duration factor — accelerating compresses weeks. */
  weeksFactor: number
}

export const TIMELINES: TimelineConfig[] = [
  { id: 'standard', label: 'Standard pace', blurb: 'Phased, balanced staffing', costFactor: 1, weeksFactor: 1 },
  { id: 'accelerated', label: 'Accelerated', blurb: 'Parallel workstreams, +1 lead', costFactor: 1.18, weeksFactor: 0.72 },
  { id: 'fixed', label: 'Hard deadline', blurb: 'Date-locked, surge capacity', costFactor: 1.34, weeksFactor: 0.58 },
]

export interface Estimate {
  costLow: number
  costHigh: number
  weeks: number
  mid: number
}

export function estimate(category: CategoryConfig, scope: ScopeConfig, timeline: TimelineConfig): Estimate {
  const mid = category.base * scope.factor * timeline.costFactor
  // Larger programs grow more in weeks than a linear scale would suggest.
  const scopeWeekFactor = 0.55 + scope.factor * 0.55
  const weeks = Math.round(category.baseWeeks * scopeWeekFactor * timeline.weeksFactor)
  return {
    mid,
    // ±18% band — a realistic spread once a vetted expert scopes the work.
    costLow: Math.round((mid * 0.82) / 1000) * 1000,
    costHigh: Math.round((mid * 1.18) / 1000) * 1000,
    weeks: Math.max(weeks, 2),
  }
}

export function formatUsd(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
