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

// register a new admin
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
      [username, email, hashedPassword, role]
    );
    const token = createToken(newAdmin.rows[0].id);
    res.status(201).json({ admin: newAdmin.rows[0], token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model:

    // create the new admin user and save it in the JWT token
    const newUser = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword]
    );
    const token = createToken(newUser.rows[0].id);
    res.status(201).json({ admin: newUser.rows[0], token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get the user/admin profile
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

// change information from the admin/user profile
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

//login to the web API
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, (user as any).password);
    if (!isMatch) {
      res.status(404).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.rows[0].id);
    // create a cookie and storage the JWT refresh token
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({ user: user.rows[0], token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 1 }); // delete the token
  res.status(200).json({ message: "Logged out successfully" });
};
