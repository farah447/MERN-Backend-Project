import { Router } from 'express'

import {
    createSingleProduct,
    deleteProductBySlug,
    getAllProducts,
    getProductsBySlug,
    searchProductsByTitle,
    updateProductBySlug,
} from '../controllers/productController'
import { upload } from '../middlewares/uploadFile'
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'
import { runValidation } from '../validation'
import { isAdmin, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.get('/search/:title', searchProductsByTitle)

router.post("/", validateCreateProduct, runValidation, upload.single('image'), createSingleProduct);

router.delete('/:slug', isLoggedOut, isAdmin, deleteProductBySlug)

router.put("/:slug", validateUpdateProduct, runValidation, updateProductBySlug);

export default router
