import express, { Request, Response } from "express";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// use form-data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// cors
app.use(cors());

app.use(logger);
app.use(cookieParser());

// import routes
import postRoutes from "./route/posts-routes";
import userRoutes from "./route/user-routes";
import commentDonasi from "./route/comment-donasi-routes"
import { protect } from "./utils/auth";

// define API v1 routes
const url = "/api/v1";

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

// multer
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

// avatar upload
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json({ message: "file uploaded", file });
});

app.use(`${url}/users`, userRoutes);
app.use(`${url}/posts`, postRoutes);

// comments
app.use(`${url}/comments/posts`, commentDonasi);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
