import { Router } from "express";
const router = Router();

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

router
  .route("/")
  .get(getAllProducts)
  .post(createProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
