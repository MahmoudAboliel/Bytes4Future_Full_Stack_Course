import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/ProductController.js";

const productRouter = express.Router();

// productRouter.get("/", getAllProductsController);
// productRouter.get("/:id", getProductByIdController);
// productRouter.post("/", createProductController);
// productRouter.patch("/:id", updateProductController);
// productRouter.delete("/:id", deleteProductController);

productRouter
  .route("/")
  .get(getAllProductsController)
  .post(createProductController);

productRouter
  .route("/:id")
  .get(getProductByIdController)
  .patch(updateProductController)
  .delete(deleteProductController);

export default productRouter;
