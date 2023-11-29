import { Category } from '../models/categorySchema'

import { createHttpError } from '../util/createHTTPError'

export const getCategoryBySlugService = async (slug: string) => {
  try {
    const category = await Category.find({ slug })
    if (category.length === 0) {
      const error = createHttpError(404, 'The Category not found')
      throw error
    }
    return category
  } catch (error) {
    throw error
  }
}
