import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

import { Order } from '../models/orderSchema'
import { IOrder } from '../types/orderTypes'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const count = await Order.countDocuments()
    const totalPages = Math.ceil(count / limit)

    if (page > totalPages) {
      page = totalPages
    }
    const skip = (page - 1) * limit
    const existingOrders: IOrder[] = await Order.find().skip(skip).limit(limit)

    if (existingOrders.length === 0) {
      throw createHttpError(404, 'There are no orders in database')
    }

    res.status(200).json({
      message: 'All orders are returned',
      payload: {
        existingOrders,
        currentPage: page,
        totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = await Order.find({ _id: id })

    if (order.length === 0) {
      throw createHttpError(404, `Order not found with this id: ${id}`)
    }

    res.status(200).json({
      message: 'Order returned',
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}

export const createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, userId } = req.body

    const newOrder: IOrder = new Order({
      productId,
      userId,
    })

    await newOrder.save()
    res.status(201).json({
      message: 'New order created',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = await Order.find({ _id: id })
    if (order.length === 0) {
      throw createHttpError(404, `Order not found with this id: ${id}`)
    }

    await Order.deleteOne({ _id: id })
    res.status(200).json({
      message: 'Order deleted',
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderbyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const updatedOrder = await Order.findOneAndUpdate({ _id: id }, req.body, { new: true })

    if (!updatedOrder) {
      throw createHttpError(404, `Product not found with this id: ${id}`)
    }

    res.send({
      message: 'Order updated',
      payload: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}
