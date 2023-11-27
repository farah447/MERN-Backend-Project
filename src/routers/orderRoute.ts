import { Router } from 'express'

import {
  placeNewOrderByUserId,
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  // updateOrderbyId,
} from '../controllers/orderController'

const ordersRouter = Router()

ordersRouter.get('/', getAllOrders)

ordersRouter.get('/:id', getSingleOrderById)

ordersRouter.delete('/:id', deleteOrderById)

ordersRouter.post('/:userId', placeNewOrderByUserId)

// ordersRouter.put('/:id', updateOrderbyId)

export default ordersRouter
