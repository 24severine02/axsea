import {defineField, defineType} from 'sanity'

// A snapshot of a cart line at the moment the order was placed — deliberately
// separate from the live `product` document, so editing a product's price later
// never rewrites the total on a past order.
export const orderItem = defineType({
  name: 'orderItem',
  title: 'Order Item',
  type: 'object',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
    }),
    defineField({
      name: 'productName',
      title: 'Product name (at time of order)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (at time of order, MUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'size', title: 'Size', type: 'string'}),
    defineField({name: 'color', title: 'Colour', type: 'string'}),
  ],
  preview: {
    select: {title: 'productName', qty: 'quantity', price: 'price'},
    prepare({title, qty, price}) {
      return {title, subtitle: `${qty} × MUR ${price}`}
    },
  },
})
