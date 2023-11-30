import { Router } from 'express'

import {
    createSingleProduct,
    deleteProductBySlug,
    getAllProducts,
    getProductsBySlug,
    updateProductBySlug,
} from '../controllers/productController'
import { uploadProduct } from '../middlewares/uploadFile'
// import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'
import { runValidation } from '../validation'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.post("/", isLoggedIn, isAdmin,
// validateCreateProduct, 
runValidation, uploadProduct.single('image'), createSingleProduct);

router.delete("/:slug", isLoggedIn, isAdmin, deleteProductBySlug)

router.put("/:slug",isLoggedIn, isAdmin, 
// validateUpdateProduct, 
runValidation, updateProductBySlug);

export default router
