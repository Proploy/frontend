import { defineField, defineType } from 'sanity'

/**
 * integrationsSection — the orbiting-rings block on the home page.
 *
 * Models `components/site/Integrations.tsx` RING_A and RING_B. The
 * `IntegrationLogo` component looks up each label case-insensitively, so we
 * use the original product-name strings (`"Slack"`, `"QuickBooks"`, …) here
 * for parity with the rendering layer.
 */
export const integrationsSection = defineType({
  name: 'integrationsSection',
  title: 'Integrations',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'ringA',
      title: 'Outer ring (rotating clockwise)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(3).max(12),
    }),
    defineField({
      name: 'ringB',
      title: 'Inner ring (rotating counter-clockwise)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(3).max(12),
    }),
  ],
  preview: { select: { title: 'title' } },
})
