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

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.get('/search/:title', searchProductsByTitle)

//router.get("/:id", getSingleProduct);

router.post('/', upload.single('image'), createSingleProduct)

router.delete('/:slug', deleteProductBySlug)

router.put('/:slug', updateProductBySlug)

export default router
