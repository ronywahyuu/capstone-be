import { Router } from "express";
import protectRoute from "../../middleware/protect-route";
import * as likeDonasiController from "../../controllers/donasi/like-donasi-controller";

const router = Router()

router.get('/:id', likeDonasiController.getLikeDonasi)
router.post('/', protectRoute, likeDonasiController.createLikeDonasi)
router.delete('/', protectRoute, likeDonasiController.deleteLikeDonasi)

export default router;
