import { Router } from "express";
import {  createCategories, deleteCategories, getCategories, getCategoryBySlug, updateCategory} from "../controllers/categoryController";

const router =Router()

router.get('/',getCategories)

router.post('/',createCategories)

router.put('/:slug',updateCategory)

router.delete('/:slug',deleteCategories)

router.get('/:slug',getCategoryBySlug)



export default router