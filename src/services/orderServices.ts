import createHttpError from 'http-errors'

import { Order } from '../models/orderSchema'
import { Products } from '../models/productSchema'
import { Users } from '../models/userSchema'
import { IOrder } from '../types/orderTypes'

export const findAllOrders = async (page: number, limit: number) => {
  const count = await Order.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0

  const existingOrders: IOrder[] = await Order.find()
    .populate('products')
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
  const order = await Order.findOne({ _id: id }).populate('products').populate('user')
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

// export const updateOrderById = async (
//   id: string,
//   productId: string,
//   userId: string
// ): Promise<IOrder> => {
//   const productExsist = await Products.exists({ _id: productId })
//   const userExsist = await Users.exists({ _id: userId })

//   if (!productExsist) {
//     throw createHttpError(404, `Product not found with this id: ${productId}`)
//   }
//   if (!userExsist) {
//     throw createHttpError(404, `User not found with this id: ${userId}`)
//   }

//   const updatedOrder = await Order.findOneAndUpdate(
//     { _id: id },
//     { productId, userId },
//     { new: true }
//   )

//   if (!updatedOrder) {
//     throw createHttpError(404, `Order not found with this id: ${id}`)
//   }

//   return updatedOrder
// }
