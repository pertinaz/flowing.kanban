import { Router, Request, Response } from "express";

import {
  registerUser,
  registerAdmin,
  login,
  logout,
} from "../controllers/authController";

import verifyToken from "../middlewares/authentication";

const authRouter = Router();

authRouter.get("/", (_req: Request, res: Response) => {
  res.send("Root path");
});

authRouter.post("/register-admin", registerAdmin); // admin registration route

authRouter.post("/register", registerUser); // user registration route

authRouter.post("/login", login); // login route

authRouter.post("/logout", verifyToken, logout); // logout route

export default authRouter;
