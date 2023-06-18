import { Router } from "express";
import protectRoute from "../../middleware/protect-route";
import * as likeBlogController from "../../controllers/blogs/like-blog-controller";
const router = Router();

// like blog
router.post("/", protectRoute, likeBlogController.createLikeBlog);

// get like blog
router.get("/:id", likeBlogController.getLikeBlog);

// like blog by user
router.get("/", protectRoute, likeBlogController.getLikeBlogByUser);

// delete like blog
router.delete("/", protectRoute, likeBlogController.deleteLikeBlog);

router.get('/', protectRoute, likeBlogController.getLikeBlogByUser);

export default router;