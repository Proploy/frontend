import { defineField, defineType } from 'sanity'

/**
 * quoteTestimonialSection — single pull-quote with attribution.
 *
 * Used wherever the marketing surface wants one prominent testimonial
 * (testimonial wall, mid-page break). Optional `logo` lets a brand mark sit
 * alongside the attribution.
 */
export const quoteTestimonialSection = defineType({
  name: 'quoteTestimonialSection',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({ name: 'quote', type: 'array', of: [{ type: 'block' }], validation: (R) => R.required() }),
    defineField({ name: 'attribution', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'attribution', subtitle: 'role' } },
})
