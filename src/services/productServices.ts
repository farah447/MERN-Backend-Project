import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Products } from '../models/productSchema'
import { IProduct } from '../types/productTypes'
import { createHttpError } from '../util/createHTTPError'

export const findProductBySlug = async (slug: string): Promise<IProduct> => {
  const products = await Products.findOne({ slug: slug })
  if (!products) {
    const error = createHttpError(404, 'Product not found with this slug')
    throw error
  }
  return products
}

export const removeProductBySlug = async (slug: string) => {
  const product = await Products.findOneAndDelete({ slug: slug })
  if (!product) {
    const error = createHttpError(404, 'Product not found with this slug')
    throw error
  }
  return product
}

export const AllProducts = async (
  page: number,
  limit: number,
  minPrice: number,
  maxPrice: number,
  search: string
) => {

  let filter = {}
  if (search) {
    const regExpSearch = new RegExp('.*' + search + '.*', 'i')
    filter = {
      $or: [{ title: { $regex: regExpSearch } }, { description: { $regex: regExpSearch } }],
    }
  }

  const count = await Products.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit
  const products = await Products.find({
    $and: [{ price: { $gt: minPrice } }, { price: { $lt: maxPrice } }],
  })
    .populate({ path: 'category', select: 'title' })
    .skip(skip)
    .limit(limit)
    .sort({ price: -1 })
    .find(filter)

  return {
    products,
    currentPage: page,
    totalPages,
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file
  const img = file?.path
  const { title, price, description, category, quantity, sold, shipping } = req.body

  const productExsist = await Products.exists({ title: title })
  if (productExsist) {
    const error = createHttpError(404, 'Product is exist with this title')
    throw error
  }
  const product: IProduct = new Products({
    title: title,
    price: price,
    image: img,
    slug: slugify(title),
    description: description,
    quantity: quantity,
    category: category,
    sold: sold,
    shipping: shipping,
  })
  await product.save()
  return product
}
