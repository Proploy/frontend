import { defineField, defineType } from 'sanity'

/**
 * heroSection — variant "home" (the landing-page hero).
 *
 * The search box itself is live (useKeywordSearch against /products) and stays
 * in code; this section supplies the static copy around it: eyebrow, rotating
 * words, subtitle, and the social-proof line.
 *
 * `rotatingWords[3]` (if present) is rendered in the cobalt accent color,
 * matching today's behavior of highlighting "Done." on the home page.
 */
export const homeHeroSection = defineType({
  name: 'homeHeroSection',
  title: 'Hero (home)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'rotatingWords',
      title: 'Rotating words',
      description: 'Up to 5 words. The last one renders in the cobalt accent.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(1).max(5),
    }),
    defineField({ name: 'subtitle', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({
      name: 'socialProof',
      title: 'Social proof',
      type: 'object',
      fields: [
        defineField({ name: 'count', type: 'string', description: 'e.g. "4,000+"' }),
        defineField({ name: 'label', type: 'string', description: 'e.g. "companies"' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'eyebrow', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }) => ({ title: `Home hero — ${title}`, subtitle }),
  },
})
