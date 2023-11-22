import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

import { Order } from '../models/orderSchema'
import { IOrder } from '../types/orderTypes'

// GET : /orders => get all orders & pagination
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingOrders: IOrder[] = await Order.find()

    if (existingOrders.length === 0) {
      throw createHttpError(404, 'There are no orders in database')
    }

    res.status(200).json({
      message: 'All orders are returned',
      payload: existingOrders,
    })
  } catch (error) {
    next(error)
  }
}

// GET : /orders/:id => get single order by id
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

// POST : /orders/ => create a new order
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
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE : /orders/:id => delete single order by id
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

// PUT : /orders/ => update an order by id
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
