import express from "express";
import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createProduct,
  allProduct,
  fileUpload,
  deleteProduct,
  updateProduct,
  detailProduct,
} from "../controllers/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// CRUD Product

// create data product
// post /api/v1/product
router.post("/", protectedMiddleware, ownerMiddleware, createProduct);

// get all data product
// get /api/v1/product
router.get("/", allProduct);

// get detail data product
// get /api/v1/product/id
router.get("/:id", detailProduct);

// put update data product
// put /api/v1/product/id
router.put("/:id", protectedMiddleware, ownerMiddleware, updateProduct);

// delete data product
// delete /api/v1/product/id
router.delete("/:id", protectedMiddleware, ownerMiddleware, deleteProduct);

// file upload
// post /api/v1/product/file-upload
router.post(
  "/file-upload",
  protectedMiddleware,
  ownerMiddleware,
  upload.single("image"),
  fileUpload
);

export default router;
