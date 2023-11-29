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
  const count = await Products.countDocuments()
  const totalPages = Math.ceil(count / limit)

  const regExpSearch = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [{ title: { $regex: regExpSearch } }, { description: { $regex: regExpSearch } }],
  }

  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit
  const products = await Products.find({
    $and: [{ price: { $gt: minPrice } }, { price: { $lt: maxPrice } }],
  })
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

export const createProduct = async (
  id: string,
  title: string,
  price: number,
  image: string,
  description: string,
  category: string,
  quantity: number,
  sold: boolean,
  shipping: string
) => {
  const productExist = await Products.exists({ title })

  if (productExist) {
    throw new Error('Product already exists with this title')
  }

  const product: IProduct = new Products({
    _id: id,
    title,
    price,
    image,
    slug: slugify(title),
    description,
    quantity,
    category,
    sold,
    shipping,
  })

  await product.save()
}
