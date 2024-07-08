import express from "express";
import {
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardsController.js";
import {
  createColumn,
  updateColumn,
  deleteColumn,
  getCardsByColumn,
} from "../controllers/columnsController.js";
import verifyToken from "../middlewares/tokenValidation.js";

const dashboardRouter = express.Router();

dashboardRouter.post("/cards", verifyToken, createCard);
dashboardRouter.put("/cards/:id", verifyToken, updateCard);
dashboardRouter.delete("/cards/:id", verifyToken, deleteCard);

dashboardRouter.post("/columns", verifyToken, createColumn);
dashboardRouter.put("/columns/:id", verifyToken, updateColumn);
dashboardRouter.delete("/columns/:id", verifyToken, deleteColumn);
dashboardRouter.get("/columns/columnId/cards", verifyToken, getCardsByColumn);

export default dashboardRouter;
