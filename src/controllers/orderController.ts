import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

import { Cart } from '../models/cartSchema'
import { Order } from '../models/orderSchema'
import { checkUserExistById, resetCart } from '../services/cartServices'
import {
  findAllOrders,
  findOrderById,
  removeOrderById,
  // updateOrderById,
} from '../services/orderServices'
import { IOrder } from '../types/orderTypes'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const result = await findAllOrders(page, limit)

    res.json({
      message: 'All orders are returned',
      payload: {
        orders: result.existingOrders,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const order = await findOrderById(id)

    res.status(200).json({
      message: 'Order returned',
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}

export const placeNewOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId

    const userExsist = await checkUserExistById(userId)
    const cartExsist = await Cart.findOne({ user: userId }).populate('products').populate('user')

    //Cart exists for user, place order, and reset cart
    if (cartExsist) {
      const newOrder: IOrder = new Order({
        user: cartExsist.user,
        products: cartExsist.products,
        amount: cartExsist.amount,
        totalProducts: cartExsist.totalProducts,
      })
      await resetCart(userId)
      await newOrder.save()
      res.status(201).json({
        message: 'Order placed successfully, and cart reseted',
        payload: newOrder,
      })
      return
    }
    //No cart for user, throw error
    throw createHttpError(404, `Cart is empty for this user id: ${userExsist._id}`)
  } catch (error) {
    next(error)
  }
}

export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    await removeOrderById(id)

    res.status(200).json({
      message: 'Order deleted',
    })
  } catch (error) {
    next(error)
  }
}

// export const updateOrderbyId = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id
//     const { productId, userId } = req.body

//     const updatedOrder = await updateOrderById(id, productId, userId)

//     res.send({
//       message: 'Order updated',
//       payload: updatedOrder,
//     })
//   } catch (error) {
//     next(error)
//   }
// }
