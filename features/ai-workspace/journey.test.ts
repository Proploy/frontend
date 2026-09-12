import { describe, expect, it } from 'vitest'

import type { EvaluationProduct } from './evaluation-types'
import {
  buildComparisonRequest,
  buildImplementationRequest,
  deriveJourney,
  documentProductName,
  joinNames,
  topProduct,
} from './journey'

const linear: EvaluationProduct = {
  product_id: 'linear',
  product_name: 'Linear',
  profile_href: null,
  available: true,
  match_score: 92,
  is_agent_selected: true,
}
const asana: EvaluationProduct = {
  product_id: 'asana',
  product_name: 'Asana',
  profile_href: null,
  available: true,
  match_score: 75,
  is_agent_selected: true,
}
const noise: EvaluationProduct = {
  product_id: 'noise',
  product_name: 'Noise',
  profile_href: null,
  available: true,
  match_score: 99,
}

const battleCard = { doc_id: 'doc_bc_1', doc_type: 'battle_card', title: 'Linear vs Asana', html: '<p>x</p>' }
const projectBrief = { doc_id: 'doc_pb_1', doc_type: 'project_brief', title: 'Implementation plan: Linear rollout', html: '<p>y</p>' }

describe('deriveJourney', () => {
  it('keeps a shortlisted product in Matches after Sam moves on from it', () => {
    // Removing a product from the shortlist puts it back in Matches. It can
    // only do that if Matches still has a place for it, so a kept product is
    // shown there whether or not Sam's latest turn named it again.
    const journey = deriveJourney({ matches: [asana], documents: [], shortlist: [linear] })

    expect(journey.products.map((product) => product.product_id)).toEqual(['linear', 'asana'])
  })

  it('does not show a shortlisted product twice', () => {
    const journey = deriveJourney({ matches: [linear, asana], documents: [], shortlist: [linear] })

    expect(journey.products.map((product) => product.product_id)).toEqual(['linear', 'asana'])
  })

  it('stays in discover until Sam has returned a product', () => {
    expect(deriveJourney({ matches: [noise], documents: [] }).stage).toBe('discover')
    expect(deriveJourney({ matches: [], documents: [] }).stage).toBe('discover')
  })

  it('nudges a comparison once two or more agent products exist', () => {
    const journey = deriveJourney({ matches: [noise, asana, linear], documents: [] })
    expect(journey.stage).toBe('compare')
    // Best score first — the order every lane and nudge renders them in.
    expect(journey.products.map((p) => p.product_id)).toEqual(['linear', 'asana'])
  })

  it('moves to implementation after a comparison brief, or when the buyer skips it', () => {
    expect(deriveJourney({ matches: [asana, linear], documents: [battleCard] }).stage).toBe('implement')
    expect(deriveJourney({ matches: [asana, linear], documents: [] }, { compareDismissed: true }).stage).toBe('implement')
    // A single product cannot be compared, so go straight to the plan.
    expect(deriveJourney({ matches: [linear], documents: [] }).stage).toBe('implement')
  })

  it('classifies documents and labels implementation briefs with their product', () => {
    const journey = deriveJourney({ matches: [asana, linear], documents: [battleCard, projectBrief] })
    expect(journey.comparisonBriefs.map((d) => d.doc_id)).toEqual(['doc_bc_1'])
    expect(journey.implementationBriefs[0].productName).toBe('Linear')
    expect(journey.comparisonBriefs[0].productName).toBeNull()
    expect(documentProductName({ title: 'Nothing matching' }, [asana, linear])).toBeNull()
  })
})

describe('journey requests', () => {
  it('asks Sam for a comparison brief naming every product', () => {
    expect(buildComparisonRequest([asana, linear])).toBe(
      'Create a comparison brief for Asana and Linear. Show side by side how each one fits my requirements, and say which you would recommend.',
    )
    expect(joinNames(['A', 'B', 'C'])).toBe('A, B and C')
  })

  it('asks Sam for an implementation brief around the chosen product', () => {
    expect(buildImplementationRequest(linear)).toBe(
      'Create an implementation brief with Linear as the recommended product. Use the products you have suggested so far as the shortlist.',
    )
  })

  it('defaults to the highest-scored product', () => {
    expect(topProduct([asana, linear])?.product_id).toBe('linear')
    expect(topProduct([])).toBeNull()
  })
})
