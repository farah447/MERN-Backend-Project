import { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  getUserOrdersByUserName,
  placeNewOrder,
} from '../controllers/orderController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const ordersRouter = Router()

ordersRouter.get('/', isLoggedIn, isAdmin, getAllOrders)

ordersRouter.get('/:id', isLoggedIn, isAdmin, getSingleOrderById)

ordersRouter.get('/user/:userName', isLoggedIn, getUserOrdersByUserName)

ordersRouter.delete('/:id', isLoggedIn, isAdmin, deleteOrderById)

ordersRouter.post('/', isLoggedIn, placeNewOrder)

export default ordersRouter
