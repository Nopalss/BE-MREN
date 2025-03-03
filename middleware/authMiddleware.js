import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import asyncHandler from "./asyncHandler.js";

// mengecek token valid/tidak
export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  // ambil token dari cookies
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Token fail");
    }
  } else {
    res.status(401);
    throw new Error("No Token");
  }
});

export const ownerMiddleware = (req, res, next) => {
  if (req.user && req.user.role !== "owner") {
    res.status(401);
    throw new Error("Not Authorized");
  }
  next();
};
