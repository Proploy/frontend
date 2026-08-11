import { defineField, defineType } from 'sanity'
import { seo } from '../shared/seo'

/**
 * post — blog article (Phase 6 reads these into /blog and /blog/[slug]).
 *
 * Body is portable text with images allowed inline. The `author` and
 * `category` refs must resolve to docs of the corresponding type. Posts are
 * ordered on the listing page by `publishedAt desc`; drafts are filtered
 * out via `defineLive`'s perspective switching.
 */
export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: (R) => R.required().max(280) }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (R) => R.required() }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'seo', type: seo.name }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle as string).toLocaleDateString() : '(no date)',
      media,
    }),
  },
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
