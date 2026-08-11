import { defineField, defineType } from 'sanity'

/**
 * A CTA pair used at the bottom of marketing pages. The href is a free string
 * (it may be an external URL like `https://cal.com/...` or an internal path
 * like `/experts`); the renderer decides how to route it.
 *
 * The auth-aware CTA logic in the navbar stays in code — Sanity supplies the
 * label strings, not the branching.
 */
export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', title: 'Href', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (cobalt)', value: 'primary' },
          { title: 'Secondary (white outline)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
})
