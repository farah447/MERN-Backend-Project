import { NextFunction, Request, Response } from 'express'
import { Error } from 'mongoose'
import slugify from 'slugify'

import { Products } from '../models/productSchema'
import { findProductBySlug, removeProductBySlug } from '../services/productServices'
import { IProduct } from '../types/productTypes'
import { createHttpError } from '../util/createHTTPError'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const count = await Products.countDocuments()
    const totalPages = Math.ceil(count / limit)

    if (page > totalPages) {
      page = totalPages
    }

    let minPrice = Number(req.query.minPrice) || 0
    let maxPrice = Number(req.query.maxPrice) || 50000

    const skip = (page - 1) * limit
    const products = await Products.find({
      $and: [{ price: { $gt: minPrice } }, { price: { $lt: maxPrice } }],
    })
      .populate('category')
      .skip(skip)
      .limit(limit)

    res.json({
      message: 'All products are returned',
      payload: {
        products,
        currentPage: page,
        totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProductsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await findProductBySlug(req.params.slug)

    res.json({ message: 'Return a single product', payload: products })
  } catch (error) {
    next(error)
  }
}

export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, title, price, description, category, quantity, sold, shipping } = req.body

    const productExsist = await Products.exists({ title: title })
    if (productExsist) {
      throw new Error('Product is exist with this title')
    }
    const product: IProduct = new Products({
      _id: id,
      title: title,
      price: price,
      slug: slugify(title),
      description: description,
      quantity: quantity,
      category: category,
      sold: sold,
      shipping: shipping,
    })
    await product.save()
    res.status(201).json({
      message: 'Single product created',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await removeProductBySlug(req.params.slug)
    res.json({
      message: 'Deleted single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const product = await Products.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    })
    if (!product) {
      const error = createHttpError(404, 'Product not found with this slug')
      throw error
    }
    res.json({
      message: 'Update a single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const searchProductsByTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.params.title
    const products = await Products.find({ title: { $regex: title, $options: 'i' } }) // i => case-insensitive

    if (products.length === 0) {
      throw createHttpError(404, `Product not found with this title: ${title}`)
    }

    res.status(200).json({
      message: 'Products returned',
      payload: products,
    })
  } catch (error) {
    next(error)
  }
}
