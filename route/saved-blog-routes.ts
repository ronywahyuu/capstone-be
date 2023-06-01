import { Router } from "express";

import * as savedBlogController from "../controllers/saved-blog-controller";
import protectRoute from "../middleware/protect-route";

const router = Router();

router.get("/", protectRoute, savedBlogController.getSavedBlog);

router.post("/", protectRoute, savedBlogController.createSavedBlog);

export default router;
