import { defineField, defineType } from 'sanity'

/**
 * footerSettings — singleInstance document.
 *
 * Drives both the marketing footer (components/site/Footer.tsx) and the
 * chrome footer (components/Footer.tsx). The columns + bottom strip + small
 * print live here. Brand entity name + copyright year come from `siteSettings`
 * (with the year kept as a literal string for now — a token like `{year}`
 * would need a renderer change).
 */
export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer settings',
  type: 'document',
  fields: [
    defineField({
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
                    defineField({ name: 'href', type: 'string', validation: (R) => R.required() }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'bottomStrip',
      title: 'Bottom strip',
      type: 'object',
      fields: [
        defineField({
          name: 'copyright',
          title: 'Copyright string',
          description: 'Use the literal text, e.g. "© 2026 Proploy Ltd. All rights reserved."',
          type: 'string',
        }),
        defineField({
          name: 'legalLinks',
          title: 'Legal links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
                defineField({ name: 'href', type: 'string', validation: (R) => R.required() }),
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'smallPrint',
      title: 'Small print',
      description: 'Fine print at the very bottom of the footer. Optional.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Footer settings' }) },
})
