import dotenv from "dotenv";
import pool from "../utils/dbConfig";
import { Request, Response } from "express";
import { CustomError, sendResponse } from "../middlewares/errorHandler";

dotenv.config();

interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const getProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id = req.user?.id;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]); // search the existence of the user by id
    if (!user) {
      sendResponse(res, 404, "User not found");
      return; // user not registered
    }
    sendResponse(res, 200, user.rows[0]);
    return; // if coincidence found show the user information as a json object.
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  const { username, email } = req.body;

  try {
    await pool.query(
      "INSERT users SET username = $1, email = $2 WHERE id = $3",
      [username, email, req.user?.id]
    );
    const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user?.id,
    ]);
    sendResponse(res, 200, updatedUser.rows[0]);
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

export const deleteUserAccount = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    sendResponse(res, 204, "Account deleted, be safe.");
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

// change information from the admin/user profile
