import { Schema, model } from 'mongoose'

import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Orders', orderSchema)
