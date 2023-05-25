import { Router } from "express";
import prisma from "../database/config";
import { login, register, signout } from "../controllers/user-controller";
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
router.post("/register", uploadAvatar.single("avatarImg"), register);
// login a user
router.post("/login", login);
router.delete("/signout", signout);

export default router;
