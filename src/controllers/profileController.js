import { pool } from "../utils/dbConfig.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email",
      [username, userId]
    );
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.user.id;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
