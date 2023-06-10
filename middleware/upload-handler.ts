import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatar");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}+${fileName}`);
  },
});

const upload = multer({ storage });

const uploadHandler = (req: any, res: any, next: any) => {
  // upload.single("avatarImg");
  next();
}




export default upload;