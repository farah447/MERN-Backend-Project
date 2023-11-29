import { NextFunction, Request, Response } from 'express'

import { Order } from '../models/orderSchema'
import {
  checkUserExistById,
  findAllOrders,
  findOrderById,
  findOrdersByUserName,
  getOrderData,
  removeOrderById,
  updateStockAndSold,
} from '../services/orderServices'
import { IOrder } from '../types/orderTypes'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const { existingOrders, currentPage, totalPages } = await findAllOrders(page, limit)

    res.status(200).json({
      message: 'All orders are returned',
      payload: {
        orders: existingOrders,
        currentPage: currentPage,
        totalPages: totalPages,
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

export const getUserOrdersByUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const order = await findOrdersByUserName(String(userName))

    res.status(200).json({
      message: 'Orders returned',
      payload: order,
    })
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

export const placeNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, orderItems } = req.body

    const userExsist = await checkUserExistById(user)

    const { amount, totalProducts, updatedProducts } = await getOrderData(orderItems)

    const newOrder: IOrder = new Order({
      user,
      orderItems,
      amount,
      totalProducts,
    })
    await newOrder.save()

    userExsist.orders.push(newOrder._id)
    await userExsist.save()

    await updateStockAndSold(updatedProducts)

    res.status(201).json({
      message: 'Order placed successfully, and stock updated',
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}
