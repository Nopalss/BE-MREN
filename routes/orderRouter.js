import express from "express";
import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createOrder,
  allOrder,
  detailOrder,
  currentUserOrder,
} from "../controllers/orderController.js";

const router = express.Router();

//post api/v1/order
// cuman diakses oleh yang sudah login
router.post("/", protectedMiddleware, createOrder);

//get api/v1/order
// cuman diakses oleh user owner
router.get("/", protectedMiddleware, ownerMiddleware, allOrder);

//get api/v1/order/current-user
// cuman diakses oleh user auth
router.get("/user/current-user", protectedMiddleware, currentUserOrder);
//get api/v1/order/:id
// cuman diakses oleh user owner
router.get("/:id", protectedMiddleware, ownerMiddleware, detailOrder);

export default router;
