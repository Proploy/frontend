import { defineField, defineType } from 'sanity'

/**
 * valuePropsSection — three numbered points on the home page.
 *
 * Models `components/site/ValueProps.tsx` POINTS = [{n, metric, metricLabel,
 * title, body}]. Capped at 3 because the component layout hardcodes three
 * columns; allowing more would silently overflow.
 */
export const valuePropsSection = defineType({
  name: 'valuePropsSection',
  title: 'Value props',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'n', title: 'Number', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'metric', title: 'Big number / metric', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'metricLabel', title: 'Metric label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'metric' } },
        },
      ],
      validation: (R) => R.length(3),
    }),
  ],
  preview: { select: { title: 'title' } },
})
