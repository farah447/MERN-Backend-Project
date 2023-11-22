import { Schema, model } from 'mongoose'
import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    productId: {
      type: String, // type: Schema.Types.ObjectId, ref: 'Product' (Relation with product schema will be be here)
      required: true,
    },
    userId: {
      type: String, // type: Schema.Types.ObjectId, ref: 'User' (Relation with user schema will be be here)
      required: true,
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Orders', orderSchema)
