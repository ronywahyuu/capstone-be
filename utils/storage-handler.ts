// import multer from "multer";

import multer from "multer";

// // storage
// const imgStorage = (type: string) => {
//   return multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, `uploads/${type}`);
//     },
//     filename: (req, file, cb) => {
//       const fileName = file.originalname.toLowerCase().split(" ").join("-");
//       cb(null, `${Date.now()}${fileName}`);
//     },
//   });
// };

// file filter
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format not supported"), false);
  }
};

// export const upload = (type: string) => {
//   return multer({ storage: imgStorage(type), fileFilter }).single("imgFile");
// };

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    // 1 MB
    fileSize: 1024 * 1024 * 1,
  },
})

export default upload;
