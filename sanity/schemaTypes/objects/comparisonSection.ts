import { defineField, defineType } from 'sanity'

import { comparisonCell } from './comparisonCell'

/**
 * comparisonSection — the multi-column feature-comparison block on
 * for-businesses.
 *
 * `comparisonCell` is registered separately (see ./comparisonCell.ts) because
 * Sanity requires named types in the schema registry when referenced by
 * `of: [{ type }]`.
 *
 * Always 3 columns (the rows store values for Traditional / Solo / Proploy in
 * that order). Sections group related rows under a heading ("Discovery &
 * matching", …).
 */
export const comparisonSection = defineType({
  name: 'comparisonSection',
  title: 'Comparison table',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'columns',
      title: 'Column headers (3)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.length(3),
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
                    defineField({
                      name: 'values',
                      title: 'Column values (3 cells)',
                      type: 'array',
                      of: [{ type: comparisonCell.name }],
                      validation: (R) => R.length(3),
                    }),
                  ],
                  preview: { select: { title: 'label' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
  ],
  preview: { select: { title: 'title' } },
})
