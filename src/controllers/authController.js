
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../utils/dbConfig.js";
import User from "../models/user.js"; // import a user-creation model
import {
  checkExistence,
  passwordStrength,
  createToken,
} from "../utils/userUtils.js";
dotenv.config();

export const registerAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    await checkExistence(email, username); // check if the account exists

    // validate the password (can create a component for this one)
    if (!passwordStrength(password)) {
      return res.status(400).son({ message: "Password is not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model:

    // create the new admin user and save it in the JWT token
    const newAdmin = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, "admin"]
    );
    const token = createToken(newAdmin.rows[0].id);
    res.status(201).json({ admin: newAdmin.rows[0], token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await checkExistence(email, username); //verify if the username/email already exists

    // check password
    if (!passwordStrength(password)) {
      return res.satus(400).json({ message: "password is not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // has the password -> in the user model

    // create the user and save it in the JWT token
    const newUser = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );
    const token = createToken(newUser.rows[0].id);
    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]); // search the existence of the user by password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user }); // if coincidence found show the user information as a json object.
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    await pool.query(
      "INSERT users SET username = $1, email = $2 WHERE id = $3",
      [username, email, req.user.id]
    );
    const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    res.status(200).json({ message: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.rows[0].id);
    // create a cookie and storage the JWT refresh token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ user: user.rows[0], token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 }); // delete the token
  res.status(200).json({ message: "Logged out successfully" });
};
