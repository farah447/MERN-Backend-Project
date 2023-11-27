import { Request, Response, NextFunction } from "express";
import slugify from 'slugify';

import { IProduct, Products } from "../models/productSchema";
import { createHttpError } from "../util/createHTTPError";
import  { AllProducts, createProduct, findProductBySlug, removeProductBySlug } from "../services/productServices";

// export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //limit and page number
//     let page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 3;

//     const count = await Products.countDocuments();
//     const totalPages = Math.ceil(count / limit);

//     if (page > totalPages){
//         page = totalPages;

        
//     }

//     let minPrice=Number(req.query.minPrice)||0
//     let maxPrice=Number(req.query.maxPrice)||50000



//     const skip = (page-1) * limit;
//         const products = await Products.find({$and: [{price:{$gt:minPrice}}, {price:{$lt:maxPrice}}]}).skip(skip).limit(limit).sort({price:-1});
//         res.json({ 
//             message: 'all products are returned', 
//             payload: {
//                 products, 
//                 currentPage: page,
//                 totalPages,
//             }
//              });
//     } catch (error) {
//         next(error);
//     }
// };




export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        let minPrice = Number(req.query.minPrice) || 0;
        let maxPrice = Number(req.query.maxPrice) || 50000;
        let search =req.query.search as string ;

        const result = await AllProducts(page, limit, minPrice, maxPrice,search);

        res.json({
            message: 'All products are returned',
            payload: {
                products: result.products,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                // product: result.products,
                
            },
        });
    } catch (error) {
        next(error);
    }
};



/*export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const product = await Products.findById({ _id: id });
        if (!product) {
            throw new Error("Product is not found with this id");
        }
        res.json({
            message: 'return single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};*/

export const getProductsBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await findProductBySlug(req.params.slug);

        res.json({ message: 'return a single product', payload: products })
    } catch (error) {
        next(error);
    }
}

export const createSingleProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, title, price, description, category, quantity, sold, shipping } = req.body;

        await createProduct(id, title, price, description, category, quantity, sold, shipping);

        res.status(201).json({
            message: 'Single product created',
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await removeProductBySlug(req.params.slug);
        res.json({
            message: 'deleted single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const product = await Products.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
        if (!product) {
            const error = createHttpError(404, 'Product not found with this slug');
            throw error;
        }
        res.json({
            message: 'update a single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};