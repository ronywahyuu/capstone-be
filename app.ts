// =================== IMPORTS ===================
import express, { Request, Response } from "express";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { upload } from "./utils/storage-handler";

const app = express();
const port = 3000;
app.use(express.json());

// cors
app.use(cors());

app.use(logger);

// =================== ROUTES DONASI ===================
import donasiRoutes from "./routes/donasi/donasi-routes";
import commentDonasi from "./routes/donasi/comment-donasi-routes";
import savedDonasiRoutes from "./routes/donasi/saved-donasi-routes";
import likeDonasiRoutes from "./routes/donasi/like-donasi-routes";

// =================== ROUTES BLOGS ===================
import blogRoutes from "./routes/blogs/blog-routes";
import commentBlogRoutes from "./routes/blogs/comment-blog-routes";
import savedBlogRoutes from "./routes/blogs/saved-blog-routes";
import likeBlogRoutes from "./routes/blogs/like-blog-routes";

// =================== ROUTES USERS ===================
import userRoutes from "./routes/users/user-routes";

app.use(bodyParser.json());
app.use(cookieParser());

// define API v1 routes
const url = "/api/v1";

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use(upload("img"));

// access media files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// user
app.use(`${url}/users`, userRoutes);

// donasi
app.use(`${url}/posts`, donasiRoutes);
app.use(`${url}/saved`, savedDonasiRoutes);
app.use(`${url}/comments/posts`, commentDonasi);
app.use(`${url}/likes/donasi`, likeDonasiRoutes);

// blogs
app.use(`${url}/blogs`, blogRoutes);
app.use(`${url}/comments/blogs`, commentBlogRoutes);
app.use(`${url}/saved/blogs`, savedBlogRoutes);
app.use(`${url}/likes/blogs`, likeBlogRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
