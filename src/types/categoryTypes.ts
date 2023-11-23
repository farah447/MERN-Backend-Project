import { Document } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: NativeDate
  updatedAt?: NativeDate
  __v: number
}
