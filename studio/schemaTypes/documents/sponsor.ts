import {defineField, defineType} from 'sanity'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Optional — leave empty to show the name as text, like today',
    }),
    defineField({name: 'url', title: 'Website', type: 'url'}),
    defineField({name: 'order', title: 'Display order', type: 'number'}),
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', media: 'logo'}},
})
