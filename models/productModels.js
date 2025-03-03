import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama Produk Harus diisi"],
    unique: [true, "Nama Produk Sudah Digunakan"],
  },
  price: {
    type: String,
    required: [true, "Harga Harus Diisi"],
  },
  description: {
    type: String,
    required: [true, "Deskripsi Harus Diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Kategori Harus Diisi"],
    enum: ["sepatu", "celana", "baju", "kemeja"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
