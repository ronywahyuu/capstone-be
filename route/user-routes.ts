import { Router } from "express";
import prisma from "../database/config";
import { getUser } from "../controllers/user-controller";
import * as authController from "../controllers/auth-controller";
import multer from "multer";

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}+${fileName}`);
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

const router = Router();

// register a new user
router.post("/register", authController.register);
// login a user
router.post("/login", authController.login);
router.delete("/signout", authController.signout);

// get detail user
router.get("/:id", getUser);

export default router;
