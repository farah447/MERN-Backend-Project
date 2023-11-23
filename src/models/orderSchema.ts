import { Schema, model } from 'mongoose'

import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Orders', orderSchema)
