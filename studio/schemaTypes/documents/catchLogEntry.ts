import {defineField, defineType} from 'sanity'

export const catchLogEntry = defineType({
  name: 'catchLogEntry',
  title: 'Catch Log Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'species',
      title: 'Species',
      type: 'string',
      description: 'Species filter buttons on the site are generated from whatever values exist here',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date caught',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'weightUnit',
      title: 'Weight unit',
      type: 'string',
      options: {list: ['lbs', 'kg'], layout: 'radio'},
      initialValue: 'lbs',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'story', title: 'Story', type: 'text', rows: 4}),
  ],
  orderings: [{title: 'Date, new first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'species', subtitle: 'location', media: 'photo'},
  },
})
