import express from "express";

import {
  getProfile,
  updateProfile,
  deleteUserAccount,
} from "../controllers/profileController";
import verifyToken from "../middlewares/authentication";
import validateRequest from "../middlewares/validateRequest";

const profileRouter = express.Router();

profileRouter.use(verifyToken);

profileRouter.get("/profile", verifyToken, getProfile);
profileRouter.put("/profile", validateRequest, updateProfile);
profileRouter.delete("/profile", deleteUserAccount);

export default profileRouter;
