import {Router} from "express"
import * as commentBlogController from "../../controllers/blogs/comments-blog-controller"
import { protect } from "../../utils/auth"

const router = Router()

router.post("/", protect, commentBlogController.createCommentBlog)

router.get("/:id",  commentBlogController.getCommentBlog)

export default router

