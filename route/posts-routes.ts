import {  Router } from "express";

import * as postsController from "../controllers/posts-controller";
import protectRoute from "../middleware/protect-route";

const router = Router();

// get posts
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPostById);

// mutate posts
router.post("/", protectRoute, postsController.createPost);
router.delete("/:id", protectRoute, postsController.deletePost);
router.put("/:id", protectRoute, postsController.deletePost);

export default router;
