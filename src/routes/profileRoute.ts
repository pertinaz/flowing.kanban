import { Router } from "express";

import {
  getProfile,
  updateProfile,
  deleteUserAccount,
} from "../controllers/profileController";
import verifyToken from "../middlewares/authentication";
// import validateRequest from "../middlewares/validateRequest";

const profileRouter = Router();

profileRouter.use(verifyToken);

profileRouter.get("/profile", getProfile);
profileRouter.put("/profile", updateProfile);
profileRouter.delete("/profile", deleteUserAccount);

export default profileRouter;
