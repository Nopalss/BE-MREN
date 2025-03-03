import multer from "multer";
import path from "path";

// type file yang boleh di input
const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// fungsi untuk menyimpan foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // mencari apakah type file sama dengan aturan type file yang berlaku
    const isValidFormat = FILE_TYPE[file.mimetype];
    // ini throw error
    let uploadError = new Error("invalid image type");

    // cek apakah ada?
    if (isValidFormat) {
      uploadError = null;
    }
    // jika salah maka erro dan jika benar maka akan disimpan di folder public dan uploads
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // ini menamai file nya
    const uniqueFile = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFile);
  },
});

export const upload = multer({ storage: storage });
