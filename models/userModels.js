import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama Harus diisi"],
    unique: [true, "Username Sudah Digunakan"],
  },
  email: {
    type: String,
    required: [true, "Email Harus Diisi"],
    unique: [true, "Email Sudah Digunakan"],
    validate: {
      validator: validator.isEmail,
      message: "Harus Menggunakan Format email Yang benar",
    },
  },
  password: {
    type: String,
    required: [true, "Password Harus Diisi"],
    minLength: [6, "Password Harus 6 Karakter"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

// sebelum melakukan save jalankan fungsi untuk meng hash password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
