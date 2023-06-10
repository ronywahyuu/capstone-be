import { Router } from "express";
import * as blogController from "../../controllers/blogs/blog-controller";
import protectRoute from "../../middleware/protect-route";
const router = Router();

// get all
router.get("/", blogController.getAllBlog);

// get single
router.get("/:id", blogController.getBlogById);

// mutate data
router.post("/", protectRoute, blogController.createBlog);
router.put("/:id", protectRoute, blogController.updateBlog);
router.delete("/:id", protectRoute, blogController.deleteBlog);
export default router;