import { Router } from "express";

import {
    createSingleProduct,
    getAllProducts,
    //getSingleProduct,
    getProductsBySlug,
    deleteProductBySlug,
    updateProductBySlug
} from "../controllers/productController";
import { upload } from "../middlewares/uploadFile";

const router = Router();

router.get("/", getAllProducts);

router.get("/", getProductsBySlug);

//router.get("/:slug", getSingleProduct);

router.post("/", upload.single('image'), createSingleProduct);

router.delete("/:slug", deleteProductBySlug);

router.put("/:slug", updateProductBySlug);

export default router;