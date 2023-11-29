import { Document } from 'mongoose'

import { IOrder } from './orderTypes'

export interface IUser extends Document {
  _id: Number
  firstName: String
  lastName: String
  userName: String
  email: String
  password: String
  image?: string
  isAdmin: Boolean
  isBanned: boolean
  orders: IOrder['_id'][]
  createdAt?: Date
  updatedAt?: Date
}

export type EmailDataType = {
  email: string
  subject: string
  html: string
}

export type UserInput = Omit<IUser, 'userName'>
