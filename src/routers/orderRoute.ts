import { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  placeNewOrder,
} from '../controllers/orderController'
import { isLoggedIn } from '../middlewares/auth'

const ordersRouter = Router()

ordersRouter.get('/', getAllOrders)

ordersRouter.get('/:id', getSingleOrderById)

ordersRouter.delete('/:id', isLoggedIn, deleteOrderById)

ordersRouter.post('/', isLoggedIn, placeNewOrder)

export default ordersRouter
