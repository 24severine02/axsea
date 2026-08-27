import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow text',
      type: 'string',
      description: 'e.g. Axel Béchard · Content Creator · Fisherman',
    }),
    defineField({
      name: 'headingLine1',
      title: 'Heading — line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLine2',
      title: 'Heading — line 2 (highlighted colour)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'primaryButton', title: 'Primary button', type: 'ctaButton'}),
    defineField({name: 'secondaryButton', title: 'Secondary button', type: 'ctaButton'}),
  ],
})
