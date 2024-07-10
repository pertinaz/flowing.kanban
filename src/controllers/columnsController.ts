//import Column from "../models/column.js";
import pool from "../utils/dbConfig.js";
import { Request, Response } from "express";
import { CustomError, sendResponse } from "../middlewares/errorHandler";

interface CustomRequest extends Request {
  user: { id: string };
}

// create column
export const createColumn = async (req: CustomRequest, res: Response) => {
  const { name } = req.body;
  const userId = req.user?.id;

  try {
    const newColumn = await pool.query(
      "INSERT INTO columns (name,user_id) VALUES ($1,$2) RETURNING *",
      [name, userId]
    );
    sendResponse(res, 201, "Column created successfully", newColumn.rows[0]);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

// edit column
export const updateColumn = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedColumn = await pool.query(
      "UPDATE columns SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, id, req.user?.id]
    );
    sendResponse(
      res,
      200,
      "Column updated successfully",
      updatedColumn.rows[0]
    );
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

// delete card
export const deleteColumn = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM columns WHERE id = $1", [id]);
    sendResponse(res, 204, "Column deleted successfully");
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

export const getCardsByColumn = async (req: CustomRequest, res: Response) => {
  const { columnId } = req.params;

  try {
    const cards = await pool.query(
      "SELECT * FROM cards WHERE column_id = $1 AND user_id = $2",
      [columnId, req.user?.id]
    );
    sendResponse(res, 200, "Cards into the column", cards.rows);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
    next(error);
  }
};

function next(_error: unknown) {
  throw new Error("Function not implemented.");
}
