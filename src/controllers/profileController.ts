import dotenv from "dotenv";
import { pool } from "../utils/dbConfig";
import { Request, Response } from "express";

dotenv.config();

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id }: { id: number } = (req as any).user; // asertion for the user existence
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]); // search the existence of the user by password
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user }); // if coincidence found show the user information as a json object.
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/*
export const updateUserProfile = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email", //check this one
      [username, userId]
    );
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/
export const updateProfile = async (req: Request, res: Response) => {
  const { username, email } = req.body;

  try {
    await pool.query(
      "INSERT users SET username = $1, email = $2 WHERE id = $3",
      [username, email, (req as any).user.id]
    );
    const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      (req as any).user.id,
    ]);
    res.status(200).json({ message: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// change information from the admin/user profile
