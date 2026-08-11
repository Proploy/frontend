import { defineField, defineType } from 'sanity'

/**
 * SEO overrides for any document that exposes them. Optional on every doc —
 * the page/post falls back to its title and excerpt when these are blank.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (Rule) => Rule.max(70).warning('Keep under ~60 chars for SERP display.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(180).warning('Keep under ~155 chars for SERP display.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
