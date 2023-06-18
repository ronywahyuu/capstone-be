import { Router } from "express";
import prisma from "../../database/config";
import * as authController from "../../controllers/users/auth-controller";
import * as userController from "../../controllers/users/user-controller";
import multer from "multer";
import validate from "../../middleware/validate";
import SchemaCreateUserValidator from "../../validators/schema-create-user-validator";
import protectRoute from "../../middleware/protect-route";


const router = Router();

// register a new user
router.post("/register", validate(SchemaCreateUserValidator), authController.register);
// login a user
router.post("/login", authController.login);
router.get("/signout", authController.signout);

// refresh token 
router.post("/refresh-token", authController.refreshToken);

// get detail user
router.get("/:id", userController.getUser);

// update user
router.put("/:id", protectRoute, userController.updateUser);

export default router;
