import express, { Request, Response } from "express";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import multer, { Multer } from "multer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use(cookieParser());

// use form-data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors());

app.use(logger);

// import routes
import postRoutes from "./route/posts-routes";
import userRoutes from "./route/user-routes";
import commentDonasi from "./route/comment-donasi-routes";
import savedDonasiRoutes from "./route/saved-donasi-routes";
import blogRoutes from "./route/blog-routes";
import commentBlogRoutes from "./route/comment-blog-routes";
import savedBlogRoutes from "./route/saved-blog-routes";
import { protect } from "./utils/auth";
import path from "path";

// define API v1 routes
const url = "/api/v1";

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

// multer
const avatarImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}-${fileName}`);
  },
});

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}${fileName}`);
  },
});

// multer file filter
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
const upload = multer({ storage: imgStorage, fileFilter }).single("imgFile");

// use multer
app.use(bodyParser.json());
app.use(upload);
// app.use(multer({storage: avatarImgStorage}).single("file"));

// app.use(multer({ storage: imgStorage, fileFilter }).single("imgFile"));

// use upload and handle error
// app.use((req: any, res: any, next: any) => {
//   upload(req, res, (err: any) => {
//     if (err instanceof multer.MulterError) {
//       res.status(400).json({
//         message: err.message,
//       });
//     } else {
//       next();
//     }
//   });
// });

// access media files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(`${url}/users`, userRoutes);
app.use(`${url}/posts`, postRoutes);

// posts donasi
app.use(`${url}/saved`, savedDonasiRoutes);
app.use(`${url}/comments/posts`, commentDonasi);

// blogs
app.use(`${url}/blogs`, blogRoutes);
app.use(`${url}/comments/blogs`, commentBlogRoutes);
app.use(`${url}/saved/blogs`, savedBlogRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
