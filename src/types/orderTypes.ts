import { Document } from 'mongoose'

export interface IOrder extends Document {
  _id: string
  productId: string // IProduct['_id']
  userId: string // IUser['_id']
  createdAt?: Date
  updatedAt?: Date
  __v: number
}
