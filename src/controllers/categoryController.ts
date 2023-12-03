import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Category } from '../models/categorySchema'
import { getCategoryBySlugService } from '../services/categoryService'
import { createHttpError } from '../util/createHTTPError'

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find()
    res.status(200).send({ message: 'Get all Categories', payload: categories })
  } catch (error) {
    next(error)
  }
}

export const createCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body

    const categoryExist = await Category.exists({ title: title })
    if (categoryExist) {
      throw createHttpError(404, 'Category already exists')
    }
    const newCategory = new Category({
      title: title,
      slug: slugify(title),
    })

    await newCategory.save()
    res.status(201).send({ message: 'The Category is created' })
  } catch (error) {
    next(error)
  }
}

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await getCategoryBySlugService(req.params.slug)
    res.status(200).send({ message: 'Get one Category', payload: category })
  } catch (error) {
    next(error)
  }
}

export const deleteCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug })
    if (!category) {
      throw createHttpError(404, 'Category is not found')
    }
    res.status(200).send({ message: 'Delete category', payload: category })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { title, slug } = req.body
    if (title) {
      slug = slugify(title)
    }

    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    })

    if (!category) {
      throw createHttpError(404, 'Category is not found')
    }
    res.status(200).send({ message: 'Update single Category', payload: category })
  } catch (error) {
    next(error)
  }
}
