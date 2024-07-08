import { pool } from "../utils/dbConfig.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
export async function checkExistence(
  email: string,
  username: string
): Promise<void> {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );
  if (result.rows.length > 0) {
    throw new Error("Email or username already exists");
  }
}

export function passwordStrength(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
}

export function createToken(_id: string): string {
  return jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  }); // create JWT token
}
