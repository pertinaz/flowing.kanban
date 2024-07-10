// import Card from "../models/card.js";
import pool from "../utils/dbConfig";
import { NextFunction, Request, Response } from "express";
import { CustomError, sendResponse } from "../middlewares/errorHandler";

interface CustomRequest extends Request {
  user?: { id: string };
}

// GET all the cards created
export const cards = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allCards = await pool.query("SELECT * FROM cards");
    sendResponse(res, 200, "All cards", allCards.rows);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

// create new card
export const createCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, columnId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 401, "User not authenticated");
    return;
  }

  try {
    const newCard = await pool.query(
      "INSERT INTO cards (title,description,column_id,user_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, description, columnId, userId]
    );
    sendResponse(res, 201, "Card created successfully", newCard.rows[0]);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

// edit/ update card
export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, columnId } = req.body;

  try {
    const updatedCard = await pool.query(
      "UPDATE cards SET title = $1, description = $2, columnId = $3 WHERE id = $4 RETURNING *",
      [title, description, columnId, id]
    );
    sendResponse(res, 200, "Card updated successfully", updatedCard.rows[0]);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

// delete card
export const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM cards WHERE id = $1", [id]);
    sendResponse(res, 204, "Card deleted successfully");
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

function next(_error: unknown) {
  throw new Error("Function not implemented.");
}
