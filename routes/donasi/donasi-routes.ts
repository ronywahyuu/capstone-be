import { Router } from "express";

// import * as postsController from "../controllers/posts-controller";
import * as donasiController from "../../controllers/donasi/donasi-controller"
import protectRoute from "../../middleware/protect-route";
import validate from "../../middleware/validate";
import SchemaPostDonasiValidator from "../../validators/schema-post-donasi-validator";

const router = Router();

// get posts
router.get("/", donasiController.getAllPosts);
router.get("/:id", donasiController.getPostById);

// mutate posts
router.post(
  "/",
  protectRoute,
  validate(SchemaPostDonasiValidator),
  donasiController.createPost
);
router.delete("/:id", protectRoute, donasiController.deletePost);
router.put("/:id", protectRoute, donasiController.updatePost);

export default router;
