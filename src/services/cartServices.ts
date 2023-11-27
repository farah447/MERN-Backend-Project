import createHttpError from 'http-errors'

import { Cart } from '../models/cartSchema'
import { Products } from '../models/productSchema'
import { Users } from '../models/userSchema'
import { ICart } from '../types/cartTypes'
import { IProduct } from '../types/productTypes'
import { IUser } from '../types/userTypes'

export const findAllCarts = async (page: number, limit: number) => {
  const count = await Cart.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0

  const existingCarts: ICart[] = await Cart.find()
    .populate('products')
    .populate('user')
    .skip(skip)
    .limit(limit)

  if (existingCarts.length === 0) {
    throw createHttpError(404, 'There are no carts in database')
  }
  return {
    existingCarts,
    currentPage: page,
    totalPages,
  }
}

export const findSingleCartByUserId = async (userId: string) => {
  const cart = await Cart.find({ user: userId }).populate('products').populate('user')

  if (cart.length === 0) {
    throw createHttpError(404, `Cart is empty for this user: ${userId}`)
  }
  return cart
}

export const resetCart = async (userId: string) => {
  const cart = await Cart.find({ user: userId }).populate('products').populate('user')

  if (cart.length === 0) {
    throw createHttpError(409, `Cart is already empty for this user: ${userId}`)
  }
  await Cart.deleteOne({ _id: cart })
}

// Validation services
export const checkUserExistById = async (userId: string): Promise<IUser> => {
  const userExsist = await Users.findOne({ _id: userId })
  if (!userExsist) {
    throw createHttpError(404, `User not found with this id: ${userId}`)
  }
  return userExsist
}
export const checkProductExistById = async (productId: string): Promise<IProduct> => {
  const productExsist = await Products.findOne({ _id: productId })
  if (!productExsist) {
    throw createHttpError(404, `Product not found with this id: ${productId}`)
  }
  return productExsist
}
