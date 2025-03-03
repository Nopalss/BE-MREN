import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import asyncHandler from "../middleware/asyncHandler.js";

// method create Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

/**
 *
 * @param {object user} user
 * @param {code status} statusCode
 * @param {respon} res
 */
const createSendResponToken = (user, statusCode, res) => {
  // buat token menggunakan method yang sudah dibuat
  const token = signToken(user._id);

  // mengecek apakah ini ditahap development atau production
  const isDev = process.env.NODE_ENV === "development" ? false : true;

  // membuat aturan cookie
  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };
  // membuat cookie
  res.cookie("jwt", token, cookieOption);

  // menghapus password agar tidak keliatan user
  user.password = undefined;
  // mengembalikan respon
  res.status(statusCode).json({
    data: user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  // ini jika di collection user tidak ada document maka data  pertama akan menjadi owner selebih nya menjadi user
  const isOwner = (await User.countDocuments()) === 0;

  const role = isOwner ? "owner" : "user";

  // insert data yang dikirim oleh user/ membuat document
  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  // memanggil function respon token
  createSendResponToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // chek tahap 1 => mengecek apahah inputan kosong atau tidak
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email/Password Tidak Boleh Kosong");
  }

  // ngambil user dengan email yang di request
  const userData = await User.findOne({
    email: req.body.email,
  });

  //  cek apakah user ada dan password nya apakah betul atau tidak
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResponToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Email/password salah");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(400);
    throw new Error("User Tidak Ditemukan");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    message: "Logout Berhasil",
  });
});
