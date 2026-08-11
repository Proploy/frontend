import { defineField, defineType } from 'sanity'

/**
 * logoMarqueeSection — horizontally scrolling logo strip.
 *
 * Distinct from logoGrid because the marquee uses a duplicated list and
 * CSS keyframes; semantically different enough to keep its own section.
 */
export const logoMarqueeSection = defineType({
  name: 'logoMarqueeSection',
  title: 'Logo marquee',
  type: 'object',
  fields: [
    defineField({ name: 'logos', type: 'array', of: [{ type: 'string' }], validation: (R) => R.min(3).max(40) }),
    defineField({
      name: 'direction',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: { select: { logos: 'logos' }, prepare: ({ logos }) => ({ title: 'Logo marquee', subtitle: `${logos?.length ?? 0} logos` }) },
})
