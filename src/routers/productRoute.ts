import { Router } from 'express'

import {
    createSingleProduct,
    deleteProductBySlug,
    getAllProducts,
    getProductsBySlug,
    updateProductBySlug,
} from '../controllers/productController'
import { uploadProduct } from '../middlewares/uploadFile'
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'
import { runValidation } from '../validation'
import { isAdmin, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.post("/", validateCreateProduct, runValidation, uploadProduct.single('image'), createSingleProduct);

router.delete('/:slug', isLoggedOut, isAdmin, deleteProductBySlug)

router.put("/:slug", validateUpdateProduct, runValidation, updateProductBySlug);

export default router
