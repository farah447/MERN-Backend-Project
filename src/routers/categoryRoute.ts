import { Router } from 'express'

import {
  createCategories,
  deleteCategories,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from '../controllers/categoryController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const router = Router()

router.get('/', getCategories)

router.post('/', isLoggedIn, isAdmin, createCategories)

router.put('/:slug', isLoggedIn, isAdmin, updateCategory)

router.delete('/:slug', isLoggedIn, isAdmin, deleteCategories)

router.get('/:slug', getCategoryBySlug)

export default router
