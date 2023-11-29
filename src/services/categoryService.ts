import { Category } from '../models/categorySchema'

export const getCategoryBySlugService = async (slug: string) => {
  try {
    const category = await Category.find({ slug })
    if (category.length === 0) {
      throw new Error('Category not found')
    }
    return category
  } catch (error) {
    throw error
  }
}
