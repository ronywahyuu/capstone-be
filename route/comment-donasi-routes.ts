import { Router } from "express";

import { protect } from "../utils/auth";
import protectRoute from "../middleware/protect-route";
// import { createCommentDonasi, getCommentDonasi } from "../controllers/comments-donasi-controller";
import * as commentDonasiController from "../controllers/comments-donasi-controller";
// import PostController from "../controllers/posts-controller";

const router = Router();
// const postController = new PostController();

// create comment
router.post('/', protectRoute, commentDonasiController.createCommentDonasi)

router.get("/:id", commentDonasiController.getCommentDonasi);

export default router;
