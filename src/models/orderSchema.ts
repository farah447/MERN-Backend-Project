import { Schema, model } from 'mongoose'

import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Products',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    totalProducts: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Orders', orderSchema)
