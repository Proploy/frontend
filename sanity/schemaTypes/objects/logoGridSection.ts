import { defineField, defineType } from 'sanity'

/**
 * logoGridSection — a static logo wall.
 *
 * `logos` are stored as brand-name strings, mirroring `LOGOS` from the
 * for-businesses page. The renderer renders them as text logos (no asset
 * upload); swap to image uploads later if brand marks get polished.
 */
export const logoGridSection = defineType({
  name: 'logoGridSection',
  title: 'Logo grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'logos',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(3).max(24),
    }),
  ],
  preview: { select: { title: 'title', logos: 'logos' }, prepare: ({ title, logos }) => ({ title: title ?? 'Logo grid', subtitle: `${logos?.length ?? 0} logos` }) },
})
