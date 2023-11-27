import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

import { Cart } from '../models/cartSchema'
import { ICart } from '../types/cartTypes'
import {
  checkProductExistById,
  checkUserExistById,
  findAllCarts,
  findSingleCartByUserId,
  resetCart,
} from '../services/cartServices'

export const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const result = await findAllCarts(page, limit)

    res.json({
      message: 'All cart are returned',
      payload: {
        carts: result.existingCarts,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleCartByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    await checkUserExistById(userId)

    const cart = await findSingleCartByUserId(userId)

    res.status(200).json({
      message: 'Cart returned',
      payload: cart,
    })
  } catch (error) {
    next(error)
  }
}

export const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId } = req.body

    const userExsist = await checkUserExistById(userId)
    const productExsist = await checkProductExistById(productId)

    const cartExsist = await Cart.findOne({ user: userId }).populate('products').populate('user')

    //Cart exists for user
    if (cartExsist) {
      const productIndex = cartExsist.products.findIndex(
        (product) => product == String(productExsist)
      )
      if (productIndex > -1) {
        //Product exists in the cart
        throw createHttpError(
          409,
          `Product already exist in the cart for this user id: ${userExsist._id}`
        )
      } else {
        //Product does not exists in cart, add new product
        cartExsist.products.push(productExsist._id)
        await cartExsist.save()

        // Update amount
        const amount = cartExsist.amount + productExsist.price + productExsist.shipping
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartExsist },
          { amount, totalProducts: cartExsist.products.length },
          { new: true }
        )

        res.status(201).json({
          message: 'Product added to cart',
          payload: updatedCart,
        })
        return
      }
    }

    //No cart for user, create new cart for user, add product to cart
    const cart: ICart = new Cart({
      user: userId,
      products: productId,
      amount: productExsist.price + productExsist.shipping,
      totalProducts: 1,
    })
    await cart.save()
    res.status(201).json({
      message: 'Cart created, and product added to cart',
      payload: cart,
    })
  } catch (error) {
    next(error)
  }
}

export const removeProductsFromCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    await checkUserExistById(userId)
    await resetCart(userId)
    res.status(200).json({
      message: 'Removed all products, your cart is empty now',
    })
  } catch (error) {
    next(error)
  }
}

export const removeSingleProductFromCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    const { productId } = req.body

    const userExsist = await checkUserExistById(userId)
    const productExsist = await checkProductExistById(productId)

    const cartExsist = await Cart.findOne({ user: userId }).populate('products')

    //Cart exists for user
    if (cartExsist) {
      const productIndex = cartExsist.products.findIndex(
        (product) => product == String(productExsist)
      )
      if (productIndex > -1) {
        //Product exists in the cart, remove it
        const filterdCart = cartExsist.products.filter(
          (product) => product != String(productExsist)
        )
        // Update products, amount, totalProducts
        const amount = cartExsist.amount - productExsist.price - productExsist.shipping
        const totalProducts = cartExsist.products.length - 1
        // Cart empty, reset
        if (totalProducts <= 0) {
          await resetCart(userId)
          res.status(200).json({
            message: 'Your cart is empty now',
          })
          return
        }
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartExsist },
          { amount, products: filterdCart, totalProducts },
          { new: true }
        )

        res.status(200).json({
          message: 'Product removed from cart, amount updated',
          payload: updatedCart,
        })
        return
      } else {
        //Product does not exists in cart, throw error
        throw createHttpError(
          404,
          `Product does not exists in cart for this user id: ${userExsist._id}`
        )
      }
    }

    //No cart for user, throw error
    throw createHttpError(404, `Cart is empty for this user id: ${userExsist._id}`)
  } catch (error) {
    next(error)
  }
}
