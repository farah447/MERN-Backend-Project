import { Schema, model } from 'mongoose'

import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    orderItems: [
      {
        qty: { type: Number, required: true },

        product: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    totalProducts: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Not Processed',
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Orders', orderSchema)
