import { Schema, model } from 'mongoose'

import { ICart } from '../types/cartTypes'

const cartSchema = new Schema(
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
      type: Number, // sum of all products + shipping
    },
    totalProducts: {
      type: Number,
    },
  },
  { timestamps: true }
)

export const Cart = model<ICart>('Carts', cartSchema)
