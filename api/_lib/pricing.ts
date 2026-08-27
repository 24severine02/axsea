import { randomUUID } from "node:crypto"
import { sanityWriteClient } from "./sanityWriteClient.js"

export type CartLine = {
  productId: string
  quantity: number
  size?: string
  color?: string
}

type ProductRow = {
  _id: string
  name: string
  price: number
  stock: "in-stock" | "low-stock" | "out-of-stock"
}

const MAX_QUANTITY_PER_LINE = 50

export async function computeOrderTotals({
  items,
  deliveryMethod,
}: {
  items: CartLine[]
  deliveryMethod: "pickup" | "delivery"
}) {
  const errors: string[] = []
  const orderItems: Array<{
    _key: string
    _type: "orderItem"
    product: { _type: "reference"; _ref: string }
    productName: string
    price: number
    quantity: number
    size?: string
    color?: string
  }> = []

  const ids = [...new Set(items.map((i) => i.productId))]

  const { products, shopSettings } = await sanityWriteClient.fetch<{
    products: ProductRow[]
    shopSettings: { deliveryFee?: number } | null
  }>(
    `{
      "products": *[_type == "product" && _id in $ids]{ _id, name, price, stock },
      "shopSettings": *[_type == "shopSettings"][0]{ deliveryFee }
    }`,
    { ids },
  )

  for (const line of items) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY_PER_LINE) {
      errors.push(`Invalid quantity for item ${line.productId}.`)
      continue
    }
    const product = products.find((p) => p._id === line.productId)
    if (!product) {
      errors.push(`One of the items in your cart is no longer available.`)
      continue
    }
    if (product.stock === "out-of-stock") {
      errors.push(`${product.name} just sold out.`)
      continue
    }
    orderItems.push({
      _key: randomUUID(),
      _type: "orderItem",
      product: { _type: "reference", _ref: product._id },
      productName: product.name,
      price: product.price,
      quantity: line.quantity,
      size: line.size,
      color: line.color,
    })
  }

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = shopSettings?.deliveryFee ?? 0
  const total = subtotal + (deliveryMethod === "delivery" ? deliveryFee : 0)

  return { orderItems, subtotal, deliveryFee, total, errors }
}
