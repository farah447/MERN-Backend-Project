import { Router } from "express";

import {
    createSingleProduct,
    getAllProducts,
    getProductsBySlug,
    deleteProductBySlug,
    updateProductBySlug,
    getSingleProduct
} from "../controllers/productController";
import { upload } from "../middlewares/uploadFile";

const router = Router();

router.get("/", getAllProducts);

router.get("/:slug", getProductsBySlug);

router.get("/", getSingleProduct);

router.post("/", upload.single('image'), createSingleProduct);

router.delete("/:slug", deleteProductBySlug);

router.put("/:slug", updateProductBySlug);

export default router;