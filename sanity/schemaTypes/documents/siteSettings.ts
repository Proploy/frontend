import { defineField, defineType } from 'sanity'

/**
 * siteSettings — singleInstance document.
 *
 * Holds global brand + contact fields referenced by chrome (footer, navbar,
 * OG defaults). Pinned to a single instance via `sanity/structure.ts` so
 * editors can't create duplicates.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'legalName',
      title: 'Legal entity name',
      description: 'For footer small print and legal pages.',
      type: 'string',
    }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (R) =>
        R.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email', invert: false }),
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'X / Twitter', value: 'x' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Dribbble', value: 'dribbble' },
                  { title: 'GitHub', value: 'github' },
                ],
                layout: 'dropdown',
              },
              validation: (R) => R.required(),
            }),
            defineField({ name: 'href', title: 'URL', type: 'url', validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'platform', subtitle: 'href' } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
