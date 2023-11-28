import { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  placeNewOrder,
  updateOrderQty,
} from '../controllers/orderController'

const ordersRouter = Router()

ordersRouter.get('/', getAllOrders)

ordersRouter.get('/:id', getSingleOrderById)

ordersRouter.delete('/:id', deleteOrderById)

ordersRouter.put('/:id', updateOrderQty)

ordersRouter.post('/', placeNewOrder)

export default ordersRouter
