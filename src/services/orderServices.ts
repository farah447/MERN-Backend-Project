import createHttpError from 'http-errors'

import { Order } from '../models/orderSchema'
import { Products } from '../models/productSchema'
import { Users } from '../models/userSchema'
import { IOrder, IOrderItem, IUpdatedProduct } from '../types/orderTypes'
import { IProduct } from '../types/productTypes'
import { IUser } from '../types/userTypes'

export const findAllOrders = async (page: number, limit: number) => {
  const count = await Order.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0

  const existingOrders: IOrder[] = await Order.find()
    .populate('orderItems.product')
    .populate('user')
    .skip(skip)
    .limit(limit)

  if (existingOrders.length === 0) {
    throw createHttpError(404, 'There are no orders in database')
  }
  return {
    existingOrders,
    currentPage: page,
    totalPages,
  }
}

export const findOrderById = async (id: string): Promise<IOrder> => {
  const order = await Order.findOne({ _id: id }).populate('orderItems.product').populate('user')
  if (!order) {
    throw createHttpError(404, `Order not found with this id: ${id}`)
  }
  return order
}

export const removeOrderById = async (id: string) => {
  const order = await Order.find({ _id: id })
  if (order.length === 0) {
    throw createHttpError(404, `Order not found with this id: ${id}`)
  }
  await Order.deleteOne({ _id: id })
  return order
}

export const getOrderData = async (orderItems: IOrderItem[]) => {
  let amount = 0
  let totalProducts = 0
  const updatedProducts = []

  // Check products exist and available in stock, calculate amount and total products, and handle updatedProducts
  for (let item of orderItems) {
    const product = await checkProductAndQty(item)

    amount += item.qty * (product.price + product.shipping)
    totalProducts += item.qty

    updatedProducts.push({
      id: product._id,
      newQuantity: product.quantity - item.qty,
      newSold: product.sold + item.qty,
    })
  }
  return {
    amount,
    totalProducts,
    updatedProducts,
  }
}
export const updateStockAndSold = async (updatedProducts: IUpdatedProduct[]) => {
  // Update product stock and sold
  for (let productUpdate of updatedProducts) {
    await Products.findByIdAndUpdate(productUpdate.id, {
      quantity: productUpdate.newQuantity,
      sold: productUpdate.newSold,
    })
  }
}

// Validation services
export const checkUserExistById = async (userId: string): Promise<IUser> => {
  const userExsist = await Users.findOne({ _id: userId })
  if (!userExsist) {
    throw createHttpError(404, `User not found with this id: ${userId}`)
  }
  return userExsist
}
export const checkProductAndQty = async (item: IOrderItem): Promise<IProduct> => {
  const { product, qty } = item
  const productExsist = await Products.findOne({ _id: product })
  if (!productExsist) {
    throw createHttpError(404, `Product not found with this id: ${product}`)
  }
  if (qty <= 0) {
    throw createHttpError(404, 'Quantity must be positve number')
  }
  if (productExsist.quantity < qty) {
    throw createHttpError(404, `Not enough stock of product with this id: ${product}`)
  }
  return productExsist
}
