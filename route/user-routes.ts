import { Router } from "express";
import prisma from "../database/config";
import * as authController from "../controllers/auth-controller";
import * as userController from "../controllers/user-controller";
import multer from "multer";
import validate from "../middleware/validate";
import SchemaCreateUserValidator from "../validators/schema-create-user-validator";

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
router.post("/register", validate(SchemaCreateUserValidator), authController.register);
// login a user
router.post("/login", authController.login);
router.delete("/signout", authController.signout);

// get detail user
router.get("/:id", userController.getUser);

// update user
router.put("/:id", userController.updateUser);

export default router;
