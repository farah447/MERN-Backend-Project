import { IProduct, Products } from "../models/productSchema";
import { createHttpError } from "../util/createHTTPError";

export const findProductBySlug = async (slug: string): Promise<IProduct> => {
    const products = await Products.findOne({ slug: slug });
    if (!products) {
        const error = createHttpError(404, 'Product not found with this slug');
        throw error;
    }
    return products;
};

export const removeProductBySlug = async (slug: string) => {
    const product = await Products.findOneAndDelete({ slug: slug });
    if (!product) {
        const error = createHttpError(404, 'Product not found with this slug');
        throw error;
    }
    return product;
};