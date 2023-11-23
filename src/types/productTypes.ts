import { Document } from 'mongoose'

import { ICategory } from './categoryTypes'

export interface IProduct extends Document {
  _id: string
  title: string
  slug: string
  price: number
  image: String
  description: string
  quantity: number
  category: ICategory['_id'];
  sold: number
  shipping: number
  createdAt?: string
  updatedAt?: string
}
