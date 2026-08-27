import {defineField, defineType} from 'sanity'

export const gearItem = defineType({
  name: 'gearItem',
  title: 'Gear Item',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description:
        'e.g. Offshore Heavy, Inshore Finesse — items sharing a category are grouped into the same tab on the site',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'type', title: 'Type', type: 'string', description: 'e.g. Reel, Rod, Boat, Tackle'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'shopLink', title: 'Shop link', type: 'url'}),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first within a category',
    }),
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})
