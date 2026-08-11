import { defineField, defineType } from 'sanity'

/**
 * mapSection — the world-map dot grid on for-experts.
 *
 * Models `MAP_PINS` from `app/(site)/for-experts/page.tsx`. Each pin's
 * position is stored as a CSS-percentage string (`"32%"`, `"13%"`) so it
 * lines up with the existing absolute-positioned rendering.
 *
 * Optional `region` lets editors name clusters without committing to
 * longitudes/latitudes or breaking the layout.
 */
export const mapSection = defineType({
  name: 'mapSection',
  title: 'Map dots',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'pins',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'top',
              title: 'Top %',
              type: 'string',
              validation: (R) => R.required().regex(/^\d+(\.\d+)?%$/, { name: 'percent', invert: false }),
            }),
            defineField({
              name: 'left',
              title: 'Left %',
              type: 'string',
              validation: (R) => R.required().regex(/^\d+(\.\d+)?%$/, { name: 'percent', invert: false }),
            }),
            defineField({ name: 'region', type: 'string', description: 'Optional label for this pin.' }),
          ],
          preview: {
            select: { region: 'region', top: 'top', left: 'left' },
            prepare: ({ region, top, left }) => ({
              title: region ?? '(unlabelled)',
              subtitle: `top ${top} · left ${left}`,
            }),
          },
        },
      ],
      validation: (R) => R.min(1).max(50),
    }),
  ],
  preview: { select: { title: 'title' } },
})
