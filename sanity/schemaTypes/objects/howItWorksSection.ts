import { defineField, defineType } from 'sanity'

/**
 * howItWorksSection — three interactive steps on the home page.
 *
 * Models `components/site/HowItWorks.tsx` STEPS = [{n, key, title, lead,
 * body, bullets[]}]. Fixed at 3 steps with 3 bullets each because the
 * accordion UI hardcodes a 3-step flow.
 */
export const howItWorksSection = defineType({
  name: 'howItWorksSection',
  title: 'How it works',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'n', title: 'Number', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'key',
              title: 'Key',
              description: 'Stable id used by the component, e.g. "discover".',
              type: 'string',
              validation: (R) =>
                R.required().regex(/^[a-z0-9-]+$/, { name: 'kebab-case', invert: false }),
            }),
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'lead', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', type: 'text', rows: 4, validation: (R) => R.required() }),
            defineField({
              name: 'bullets',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (R) => R.length(3),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'lead' } },
        },
      ],
      validation: (R) => R.length(3),
    }),
  ],
  preview: { select: { title: 'title' } },
})
