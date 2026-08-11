import { defineField, defineType } from 'sanity'

/**
 * navigation — singleInstance document.
 *
 * Owns the labels + ordering for the nav. The auth-aware CTA branching
 * (sign in vs go-to-workspace) stays in `components/Navbar.tsx` — Sanity
 * supplies the strings, not the conditions.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutLinks',
      title: 'About menu links',
      description: 'Top-level "About" dropdown items.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'href', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'ctaLabels',
      title: 'Auth CTA labels',
      description:
        'Static labels for the two auth CTAs. The branching (signed-in vs signed-out) stays in code.',
      type: 'object',
      fields: [
        defineField({ name: 'signIn', title: 'Sign in label', type: 'string' }),
        defineField({ name: 'getStarted', title: 'Get started label', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
