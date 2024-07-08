import { Router } from "express";

import {
  register,
  registerAdmin,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

import verifyToken from "../middlewares/tokenValidation.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.send("Root path");
});

authRouter.post("/register-admin", registerAdmin); // admin registration route

authRouter.post("/register", register); // user registration route

authRouter.post("/login", login); // login route

authRouter.post("/logout", verifyToken, logout); // logout route

authRouter.get("/profile", verifyToken, getProfile); // profile route

authRouter.get("/profile", verifyToken, updateProfile); // profile route

export default authRouter;
