import { defineField, defineType } from 'sanity'
import { iconKey } from '../shared/iconKey'

/**
 * solutionCardsSection — the four-step "Brief / Match / Track / Stay
 * supported" grid on for-businesses.
 *
 * Models `SOLUTION_CARDS` from `app/(site)/for-businesses/page.tsx`. The icon
 * color is constrained because today every card renders the icon in white on
 * a dark background; `gray` is reserved for values/cards that opt for the
 * light variant.
 */
export const solutionCardsSection = defineType({
  name: 'solutionCardsSection',
  title: 'Solution cards',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            iconKey,
            defineField({
              name: 'iconColor',
              title: 'Icon color',
              type: 'string',
              options: {
                list: [
                  { title: 'White (on dark bg)', value: 'white' },
                  { title: 'Gray (#414651)', value: 'gray' },
                ],
                layout: 'radio',
              },
              initialValue: 'white',
              validation: (R) => R.required(),
            }),
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'iconKey' } },
        },
      ],
      validation: (R) => R.min(2).max(6),
    }),
  ],
  preview: { select: { title: 'title' } },
})
