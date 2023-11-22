export interface Error {
    status?: number;
    message?: string;
}

export type ProductType = {
    _id: string;
    title: string;
    price: number;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    shipping: number;
    createdAt?: NativeDate;
    updatedAt?: NativeDate;
};

export type ProductInput = Omit<ProductType, "_id">;