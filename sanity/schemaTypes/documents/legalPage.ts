import { defineField, defineType } from 'sanity'
import { seo } from '../shared/seo'

/**
 * legalPage — static legal/company docs (Terms, Privacy, Cookies, Licenses).
 *
 * Rendered at `/legal/[slug]`. The footer links resolve to slugs of these
 * docs once Phase 6 wires them up.
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (R) => R.required(),
      description: 'e.g. "terms", "privacy", "cookies", "licenses"',
    }),
    defineField({ name: 'effectiveDate', type: 'date', validation: (R) => R.required() }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'seo', type: seo.name }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'effectiveDate', slug: 'slug.current' },
    prepare: ({ title, subtitle, slug }) => ({
      title,
      subtitle: `/${slug ?? '?'} · effective ${subtitle ?? '—'}`,
    }),
  },
})
