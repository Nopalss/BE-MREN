import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModels.js";
import Product from "../models/productModels.js";
const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  // cek apakah cart ada atau kosong
  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang masih kosong");
  }
  // ini template
  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    // ini mengecek apakah di cart ada produk nya
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("id produk tidak ditemukan");
    }
    // ini mengambil nama, harga dan id produk nya
    const { name, price, _id } = productData;
    // ini disimpan dalam single data
    const singleData = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    // dan di satukan ke dalam order item
    orderItem = [...orderItem, singleData];

    // ini mengihitung total
    total += cart.quantity * price;
  }

  const order = await Order.create({
    total,
    itemsDetail: orderItem,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  return res.status(200).json({
    message: "Berhasil melakukan order",
    orderItem,
    total,
  });
});

const allOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({
    message: "Berhasil Mengambil data Order",
    data: orders,
  });
});

const detailOrder = asyncHandler(async (req, res) => {
  const orders = await Order.findById(req.params.id);
  res.status(200).json({
    message: "Berhasil Mengambil data detail Order",
    data: orders,
  });
});

const currentUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    message: "Berhasil Mengambil data Orderan",
    data: orders,
  });
});

export { createOrder, allOrder, detailOrder, currentUserOrder };
