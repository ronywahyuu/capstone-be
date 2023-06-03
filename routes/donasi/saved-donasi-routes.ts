import { Router } from "express";

import * as savedDonasiController from "../../controllers/donasi/saved-donasi-controller";
import protectRoute from "../../middleware/protect-route";

const router = Router();

router.get("/", protectRoute, savedDonasiController.getSavedDonasi);

router.post("/", protectRoute, savedDonasiController.createSavedDonasi);

router.delete("/", protectRoute, savedDonasiController.deleteSavedDonasi);
export default router;
