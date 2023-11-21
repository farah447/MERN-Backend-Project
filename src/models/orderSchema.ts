import { Schema, model } from 'mongoose'

const orderSchema = new Schema(
  {
    productId: {
      type: Number,
      required: true,
    }, // Relation with product schema will be be here
    userId: {
      type: Number,
      required: true,
    }, // Relation with user schema will be be here
  },
  { timestamps: true }
)

export const Order = model('Orders', orderSchema)
