import express from "express";
import {
  finduserByEmailController,
  getUserProjectsController,
  googleLoginController,
  googleSignupController,
  loginController,
  logoutController,
  searchUserByEmailController,
  signupController,
} from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/auth.middlewares";

export const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google-signup", googleSignupController);
router.post("/google-login", googleLoginController);
router.get("/projects", getUserProjectsController);
router.get("/search/:q", verifyToken, searchUserByEmailController);
router.post("/logout", logoutController);
router.get("/:email", verifyToken, finduserByEmailController);
