import { defineField, defineType } from 'sanity'

/**
 * industriesSection — six industry tabs on the home page.
 *
 * Models `components/site/Industries.tsx` INDUSTRIES = [{key, label,
 * solutions:[{name, blurb, proof, proofLabel}]}]. Fixed at 6 because the
 * UI renders six tabs; allow more and the layout breaks.
 */
export const industriesSection = defineType({
  name: 'industriesSection',
  title: 'Industries',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'industries',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              type: 'string',
              description: 'Stable URL-friendly id, e.g. "manufacturing".',
              validation: (R) =>
                R.required().regex(/^[a-z0-9-]+$/, {
                  name: 'kebab-case',
                  invert: false,
                }),
            }),
            defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'solutions',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
                    defineField({ name: 'blurb', type: 'text', rows: 2, validation: (R) => R.required() }),
                    defineField({ name: 'proof', type: 'string', validation: (R) => R.required() }),
                    defineField({ name: 'proofLabel', type: 'string', validation: (R) => R.required() }),
                  ],
                  preview: { select: { title: 'name', subtitle: 'proof' } },
                },
              ],
              validation: (R) => R.length(3),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'key' } },
        },
      ],
      validation: (R) => R.length(6),
    }),
  ],
  preview: { select: { title: 'title' } },
})
