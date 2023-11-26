import { Router } from "express";

import {
    createSingleProduct,
    deleteProductBySlug,
    getAllProducts,
    getProductsBySlug,
    updateProductBySlug,
} from "../controllers/productController";
import { upload } from "../middlewares/uploadFile";
import { runValidation } from "../validation";
import { validateCreateProduct, validateUpdateProduct } from "../validation/productValidation";

const router = Router();

router.get("/", getAllProducts);

router.get("/:slug", getProductsBySlug);

//router.get("/:id", getSingleProduct);

router.post("/", validateCreateProduct, runValidation, upload.single('image'), createSingleProduct);

router.delete("/:slug", deleteProductBySlug);

router.put("/:slug", validateUpdateProduct, runValidation, updateProductBySlug);

export default router;