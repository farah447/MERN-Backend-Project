import { Document } from 'mongoose'

import { IProduct } from './productTypes'
import { IUser } from './userTypes'

export interface IOrder extends Document {
  _id: string
  user: IUser['_id']
  orderItems: IOrderItem[]
  amount: number
  totalProducts: number
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

export interface IOrderItem {
  qty: number
  product: IProduct['_id']
}

export interface IUpdatedProduct {
  id: string
  newQuantity: number
  newSold: number
}
