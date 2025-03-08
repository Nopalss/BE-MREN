import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModels.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);
  return res.status(201).json({
    message: "Product Berhasil Ditambahkan",
    data: newProduct,
  });
});

const allProduct = asyncHandler(async (req, res) => {
  // req query / ngambil query url
  let { category, page, limit, name } = req.query;

  // ini syntaks manggil data sesuai category aja tapi belum di jalankan
  let query;
  if (name) {
    query = Product.find({
      // ini pake regex dan tidak case sesitive
      name: { $regex: name, $options: "i" },
    });
  } else if (category) {
    query = Product.find({ category });
  } else {
    query = Product.find();
  }

  /**
   * * 1 untuk mengoversi string menjadi number
   * jika req.query.page/limit tidak ada maka defaultnya 1/30
   *
   */
  page = page * 1 || 1;
  const limitData = limit * 1 || 30;
  // jika (1 - 1) * 30 = 0 * 30 = 0 -> maka data yang ditampilkan mulai dari 0
  // jika (2 - 1) * 30 = 1 * 30 = 30 -> maka data yang ditampilkan mulai dari 30
  const skipData = (page - 1) * limitData;

  // melewatkan data sebanyak skipData dan mengambil maksimal bari data sebesar limitData
  query = query.skip(skipData).limit(limitData);

  // validasi jika page dimasukan kedalam query
  const countProduct = await Product.countDocuments();
  if (req.query.page) {
    // menghitung total product DESCLAIMER INI TIDAK ADA SANGKUT PAUT NYA SAMA CATEGORY YANG DICARI

    //jika malah skipData yang paling banyak dari pada keseluruhan data product maka kirim error
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("This Page Doesn't exist");
    }
  }
  const data = await query;
  return res.status(200).json({
    message: "Data berhasil diambil",
    data,
    count: countProduct,
  });
});

const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const data = await Product.findById(paramsId);

  if (!data) {
    res.status(404);
    throw new Error("Product Tidak ditemukan");
  }

  return res.status(200).json({
    message: "Data Berhasil Ditemukan",
    data,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  const updateData = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Update Produk Berhasil",
    data: updateData,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await Product.findByIdAndDelete(paramId);
  return res.status(200).json({
    message: "Produk Berhasil Dihapus",
  });
});

// ini lokal
// const fileUpload = asyncHandler(async (req, res) => {
//   const file = req.file;
//   if (!file) {
//     res.status(400);
//     throw new Error("Tidak ada File yang diinput");
//   }

//   const imageFileName = file.filename;
//   const pathImageFile = `/uploads/${imageFileName}`;

//   res.status(201).json({
//     massage: "Image Berhasil Di upload",
//     image: pathImageFile,
//     file,
//   });
// });

// ini cloudinary
const fileUpload = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png"],
    },
    function (err, result) {
      if (err) {
        return res.status(500).json({
          message: "gagal upload gambar",
          error: err,
        });
      }
      res.json({
        message: "Gambar Berhasil di Upload",
        url: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

export {
  createProduct,
  allProduct,
  fileUpload,
  deleteProduct,
  updateProduct,
  detailProduct,
};
