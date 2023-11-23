import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, 'category title must be at least 3 characters'],
      maxlength: [300, 'category title must be at least 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
)

export const Category = model('categories', categorySchema)
