import { Document } from 'mongoose'

import { IProduct } from './productTypes'
import { IUser } from './userTypes'

export interface ICart extends Document {
  _id: string
  user: IUser['_id']
  products: IProduct['_id'][]
  amount: number
  totalProducts: number
  createdAt?: Date
  updatedAt?: Date
  __v: number
}
