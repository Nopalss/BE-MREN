import express from "express";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();
const port = 3000;

// Middleware agar bisa nangkep data
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.send("hello world");
});

// parent authRouter
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
//middleware error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`applikasi berjalan di port ${port}`);
});

// connect mongodb
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log("database connect");
  })
  .catch((err) => {
    console.log(err);
  });
