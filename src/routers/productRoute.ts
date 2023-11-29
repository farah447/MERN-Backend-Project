import { Router } from 'express'

import {
    createSingleProduct,
    deleteProductBySlug,
    getAllProducts,
    getProductsBySlug,
    updateProductBySlug,
} from '../controllers/productController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { uploadProduct } from '../middlewares/uploadFile'
import { runValidation } from '../validation'
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.post(
  '/',
  validateCreateProduct,
  isLoggedIn,
  isAdmin,
  runValidation,
  uploadProduct.single('image'),
  createSingleProduct
)

router.delete('/:slug', isLoggedIn, isAdmin, deleteProductBySlug)

router.put('/:slug', validateUpdateProduct, runValidation, updateProductBySlug)

export default router
