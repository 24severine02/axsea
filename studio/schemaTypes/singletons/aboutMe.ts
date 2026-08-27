import {defineField, defineType} from 'sanity'

export const aboutMe = defineType({
  name: 'aboutMe',
  title: 'About Me Section',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'personalBestValue', title: 'Personal best value', type: 'string', description: 'e.g. 248 lbs'}),
    defineField({
      name: 'personalBestLabel',
      title: 'Personal best label',
      type: 'string',
      description: 'e.g. Personal Best Bluefin',
    }),
    defineField({
      name: 'headingLine1',
      title: 'Heading — line 1',
      type: 'string',
      description: "e.g. Hey, I'm Axel.",
    }),
    defineField({
      name: 'headingLine2',
      title: 'Heading — line 2 (highlighted colour)',
      type: 'string',
      description: 'e.g. I Fish. I Film. I Teach.',
    }),
    defineField({
      name: 'bioParagraphs',
      title: 'Bio paragraphs',
      type: 'array',
      of: [{type: 'text', rows: 4}],
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [{type: 'timelineEntry'}],
    }),
  ],
})
