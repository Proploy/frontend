import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'social',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', type: 'url' }),
        defineField({ name: 'x', type: 'url' }),
        defineField({ name: 'website', type: 'url' }),
      ],
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})
