import { defineField, defineType } from 'sanity'
import { cta } from '../shared/cta'

/**
 * heroSection — variant "marketing" (the for-businesses / for-experts hero).
 *
 * Distinct from `homeHeroSection` because there's no rotating-word animation
 * here — just a static title + subtitle + CTA pair. Phase 4's renderer maps
 * this onto the existing hero block.
 */
export const marketingHeroSection = defineType({
  name: 'marketingHeroSection',
  title: 'Hero (marketing page)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subtitle', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: cta.name }],
      validation: (R) => R.min(1).max(3),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'eyebrow' },
    prepare: ({ title, subtitle }) => ({ title: `Marketing hero — ${title}`, subtitle }),
  },
})
