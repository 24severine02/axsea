import {defineField, defineType} from 'sanity'

// Orders are created by the checkout flow (via a server-side function — never
// directly from the browser), not typed in by hand here. In the Studio, Axel's
// job is to review them and move `status` along; everything else is locked as
// read-only so a stray click can't quietly change a customer's order total.
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderRef',
      title: 'Order reference',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'orderItem'}],
      readOnly: true,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'customerName', title: 'Customer name', type: 'string', readOnly: true}),
    defineField({name: 'customerPhone', title: 'Customer phone', type: 'string', readOnly: true}),
    defineField({
      name: 'customerEmail',
      title: 'Customer email',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'deliveryMethod',
      title: 'Delivery method',
      type: 'string',
      options: {list: ['pickup', 'delivery'], layout: 'radio'},
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Delivery address',
      type: 'text',
      rows: 2,
      readOnly: true,
      hidden: ({parent}) => parent?.deliveryMethod !== 'delivery',
    }),
    defineField({name: 'subtotal', title: 'Subtotal (MUR)', type: 'number', readOnly: true}),
    defineField({name: 'deliveryFee', title: 'Delivery fee (MUR)', type: 'number', readOnly: true}),
    defineField({name: 'total', title: 'Total (MUR)', type: 'number', readOnly: true}),
    defineField({
      name: 'paymentReference',
      title: 'Payment reference (from customer)',
      type: 'string',
      description: 'The MCB Juice transaction ref the customer typed in',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['pending', 'confirmed', 'shipped'], layout: 'radio'},
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'createdDesc', by: [{field: '_createdAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'orderRef', customer: 'customerName', status: 'status', total: 'total'},
    prepare({title, customer, status, total}) {
      return {title: `${title} — ${customer}`, subtitle: `${status} · MUR ${total}`}
    },
  },
})
