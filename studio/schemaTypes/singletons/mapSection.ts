import {defineField, defineType} from 'sanity'

export const mapSection = defineType({
  name: 'mapSection',
  title: 'Fishing Spots Map',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hintText',
      title: 'Hint text',
      type: 'string',
      description: 'e.g. Tap a pin for the inside scoop.',
    }),
  ],
})
