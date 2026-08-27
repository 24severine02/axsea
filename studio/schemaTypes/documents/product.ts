import {defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'price',
      title: 'Price (MUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Leave empty if this product has no sizes',
    }),
    defineField({
      name: 'colors',
      title: 'Colours',
      type: 'array',
      of: [{type: 'productColor'}],
      description: 'Leave empty if this product has no colour options',
    }),
    defineField({
      name: 'stock',
      title: 'Stock status',
      type: 'string',
      options: {list: ['in-stock', 'low-stock', 'out-of-stock'], layout: 'radio'},
      initialValue: 'in-stock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stockCount',
      title: 'Units left',
      type: 'number',
      description: 'Only shown to customers when stock status is "low-stock"',
      hidden: ({parent}) => parent?.stock !== 'low-stock',
    }),
    defineField({
      name: 'featured',
      title: 'Show in homepage teaser',
      type: 'boolean',
      initialValue: false,
      description: 'The homepage "Rep the Brand" section shows a few featured products',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'stock', media: 'image'},
  },
})
