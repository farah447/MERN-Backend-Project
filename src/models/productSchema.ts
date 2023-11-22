import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    _id: string;
    title: string;
    slug: string;
    price: number;
    image: String;
    description: string;
    quantity: number;
    //category: ICategory['_id'];
    sold: number;
    shipping: number;
    createdAt?: string;
    updatedAt?: string;
}

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Product title must be at least 3 characters long"],
        maxlength: [300, "Product title must be at most 300 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    price: {
        type: Number,
        require: true,
        trim: true,
    },
    image: {
        type: String,
        default: "public/images/products/default.png",
    },
    /*category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },*/
    description: {
        type: String,
        required: true,
        trim: true,
        minlingth: [3, "must be at leaset 3 characters long"],
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
    },
    sold: {
        type: Number,
        required: true,
        trim: true,
    },
    shipping: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

export const Products = model<IProduct>("Products", productSchema);
