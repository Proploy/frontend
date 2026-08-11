import { defineField, defineType } from 'sanity'

/**
 * metricsSection — two distinct shapes used across pages:
 *
 *  - `simple`   — `{ value, label }` (for-businesses "400+ Rollouts delivered")
 *  - `detailed` — `{ value, title, body (portable text) }`
 *                 (for-experts "400+ Rollouts delivered" + paragraph body)
 *
 * Modeled as a discriminated object on `variant` so editors pick the right
 * shape once and we don't end up with half-empty items in the renderer.
 */
export const metricsSection = defineType({
  name: 'metricsSection',
  title: 'Metrics',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Simple — value + label', value: 'simple' },
          { title: 'Detailed — value + title + body', value: 'detailed' },
        ],
        layout: 'radio',
      },
      initialValue: 'simple',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'label', type: 'string', hidden: ({ parent }) => parent?.variant === 'detailed' }),
            defineField({ name: 'title', type: 'string', hidden: ({ parent }) => parent?.variant === 'simple' }),
            defineField({
              name: 'body',
              type: 'array',
              of: [{ type: 'block' }],
              hidden: ({ parent }) => parent?.variant === 'simple',
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ?? '' }),
          },
        },
      ],
      validation: (R) => R.min(2).max(6),
    }),
  ],
  preview: {
    select: { items: 'items', variant: 'variant' },
    prepare: ({ items, variant }) => ({
      title: `Metrics (${variant ?? 'simple'})`,
      subtitle: `${items?.length ?? 0} item(s)`,
    }),
  },
})
