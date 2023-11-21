export interface IOrder {
  _id: string
  productId: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type OrderInput = Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>
