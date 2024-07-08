import express from "express";

import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/profileController.js";
import verifyToken from "../middlewares/tokenValidation.js";
import validateRequest from "../middlewares/validateRequest.js";

const profileRouter = express.Router();

profileRouter.use(verifyToken);

profileRouter.get("/profile", getUserProfile);
profileRouter.put("/profile", validateRequest, updateUserProfile);
profileRouter.delete("/profile", deleteUserAccount);

export default profileRouter;
