import { defineField, defineType } from 'sanity'
import { colorHex } from '../shared/colorHex'

/**
 * caseStudiesSection — the four-case testimonial grid on for-businesses.
 *
 * Models `CASE_STUDIES` from `app/(site)/for-businesses/page.tsx`. The
 * `color` is the company-accent hex that tints the case-card border; today
 * these are brand-style hex literals (`#155eef`, `#079455`, …) which the
 * colorHex validator enforces.
 */
export const caseStudiesSection = defineType({
  name: 'caseStudiesSection',
  title: 'Case studies',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'cases',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'company', type: 'string', validation: (R) => R.required() }),
            colorHex,
            defineField({ name: 'quote', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'company', subtitle: 'color' } },
        },
      ],
      validation: (R) => R.min(1).max(8),
    }),
  ],
  preview: { select: { title: 'title' } },
})
