import { Document } from 'mongoose'

import { IProduct } from './productTypes'
import { IUser } from './userTypes'

export interface IOrder extends Document {
  _id: string
  productId: IProduct['_id']
  userId: IUser['_id']
  createdAt?: Date
  updatedAt?: Date
  __v: number
}
