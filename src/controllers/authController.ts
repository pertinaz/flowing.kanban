import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user";
import pool from "../utils/dbConfig";
import { Request, Response } from "express";
import {
  checkExistence,
  passwordStrength,
  createToken,
} from "../utils/userutils";
dotenv.config();

// error type
interface CustomError extends Error {
  code?: number;
  details: string;
}

// helper function for the response status
const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null
) => {
  res.status(status).json({ message, data });
};

// register a new admin
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    username,
    email,
    password,
    role = "admin",
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
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model:

    // create the new admin user and save it in the JWT token
    const newAdmin = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
    );
    const token = createToken(newAdmin.rows[0].id);
    sendResponse(res, 201, "Admin registered successfully", {
      admin: newAdmin.rows[0],
      token,
    });
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

// register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  } = req.body;
  try {
    await checkExistence(email, username); // check if the account exists

    // validate the password (can create a component for this one)
    if (!passwordStrength(password)) {
      res.status(400).json({ message: "Password is not strong enough" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model:

    // create the new admin user and save it in the JWT token
    const newUser = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword]
    );
    const token = createToken(newUser.rows[0].id);
    sendResponse(res, 201, "User registered successfully", {
      user: newUser.rows[0],
      token,
    });
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

//login to the web API
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      sendResponse(res, 404, "Invalid credentials");
      return;
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      sendResponse(res, 404, "Invalid credentials");
      return;
    }

    const token = createToken(user.rows[0].id);
    // create a cookie and storage the JWT refresh token
    res.cookie("token", token, {
      httpOnly: true,
    });
    sendResponse(res, 200, "Login successful", { user: user.rows[0], token });
  } catch (error) {
    sendResponse(res, 500, (error as CustomError).message);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 1 }); // delete the token
  sendResponse(res, 200, "Logged out successfully");
};
