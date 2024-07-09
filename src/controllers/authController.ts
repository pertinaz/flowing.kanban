import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../utils/dbConfig";
import { Request, Response } from "express";
import {
  checkExistence,
  passwordStrength,
  createToken,
} from "../utils/userutils";
dotenv.config();

export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    username,
    email,
    password,
    role,
  }: {
    username: string;
    email: string;
    password: string;
    role?: string;
  } = req.body;
  try {
    await checkExistence(email, username); // check if the account exists

    // validate the password (can create a component for this one)
    if (!passwordStrength(password)) {
      res.status(400).json({ message: "Password is not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model:

    // create the new admin user and save it in the JWT token
    const newAdmin = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, "admin"]
    );
    const token = createToken(newAdmin.rows[0].id);
    res.status(201).json({ admin: newAdmin.rows[0], token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
