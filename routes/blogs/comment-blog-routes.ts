import {Router} from "express"
import * as commentBlogController from "../../controllers/blogs/comments-blog-controller"
import { protect } from "../../utils/auth"
import protectRoute from "../../middleware/protect-route"

const router = Router()

router.post("/", protectRoute, commentBlogController.createCommentBlog)

router.get("/:id",  commentBlogController.getCommentBlog)

export default router

