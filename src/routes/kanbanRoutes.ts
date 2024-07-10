import { Router } from "express";
import {
  cards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardsController";
import {
  columns,
  createColumn,
  updateColumn,
  deleteColumn,
  getCardsByColumn,
} from "../controllers/columnsController";
import verifyToken from "../middlewares/authentication";

const dashboardRouter = Router();

dashboardRouter.use(verifyToken);

dashboardRouter.get("/cards", cards); // show all cards created

dashboardRouter.post("/cards", createCard); // POST a new card
dashboardRouter.put("/cards/:id", updateCard); // PUT update a card
dashboardRouter.delete("/cards/:id", deleteCard); // DELETE a card

dashboardRouter.get("/columns", columns); // GET show all columns created
dashboardRouter.post("/columns", createColumn); // POST create a new column
dashboardRouter.put("/columns/:id", updateColumn); // PUT update the specified column
dashboardRouter.delete("/columns/:id", deleteColumn); // DELETE the specified column
dashboardRouter.get("/columns/:columnId/cards", getCardsByColumn); // GET shows the cards linked to the specified column

export default dashboardRouter;
