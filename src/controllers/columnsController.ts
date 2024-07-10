//import Column from "../models/column.js";
import pool from "../utils/dbConfig.js";
import { Request, Response } from "express";

// create column
export const createColumn = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req as any).user.id;

  try {
    const newColumn = await pool.query(
      "INSERT INTO columns (name,user_id) VALUES ($1,$2) RETURNING *",
      [name, userId]
    );
    res.status(201).json(newColumn.rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// edit column
export const updateColumn = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updateColumn = await pool.query(
      "UPDATE columns SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, id, (req as any).user.id]
    );
    res.status(200).json(updateColumn.rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// delete card
export const deleteColumn = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM columns WHERE id = $1", [id]);
    res.status(204).json({ message: "Column deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCardsByColumn = async (req: Request, res: Response) => {
  const { columnId } = req.params;

  try {
    const cards = await pool.query(
      "SELECT * FROM cards WHERE column_id = $1 AND user_id = $2",
      [columnId, (req as any).user.id]
    );
    res.status(200).json(cards.rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};