import { Router } from 'express'

import {
  addProductToCart,
  getAllCarts,
  getSingleCartByUserId,
  removeProductsFromCartByUserId,
  removeSingleProductFromCartByUserId,
} from '../controllers/cartController'

const cartsRouter = Router()

cartsRouter.get('/', getAllCarts)
cartsRouter.get('/:userId', getSingleCartByUserId)
cartsRouter.delete('/:userId', removeProductsFromCartByUserId)
cartsRouter.put('/:userId', removeSingleProductFromCartByUserId)
cartsRouter.post('/', addProductToCart)

export default cartsRouter
