import Card from "../models/card.js";
import { pool } from "../utils/dbConfig.js";

// create new card
export const createCard = async (req, res) => {
  const { title, description, columnId } = req.body;
  const userId = req.user.id;

  try {
    const newCard = await pool.query(
      "INSERT INTO cards (title,description,column_id,user_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, description, columnId, userId]
    );
    res.status(201).json(newCard.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit/ update card
export const updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description, columnId } = req.body;

  try {
    const updateCard = await pool.query(
      "UPDATE cards SET title = $1, description = $2, columnId = $3 WHERE id = $4 RETURNING *",
      [title, description, columnId, id]
    );
    res.status(200).json(updateCard.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete card
export const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM cards WHERE id = $1", [id]);
    res.status(204).json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
