import { Router } from "express";

import * as postsController from "../controllers/posts-controller";
import protectRoute from "../middleware/protect-route";
import validate from "../middleware/validate";
import SchemaPostDonasiValidator from "../validators/schema-post-donasi-validator";

const router = Router();

// get posts
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPostById);

// mutate posts
router.post(
  "/",
  protectRoute,
  validate(SchemaPostDonasiValidator),
  postsController.createPost
);
router.delete("/:id", protectRoute, postsController.deletePost);
router.put("/:id", protectRoute, postsController.updatePost);

export default router;
