import { pool } from "./dbConfig";
import jwt from "jsonwebtoken";
import User from "../models/user";

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

// utility for token creation
const token: string = process.env.JWT_SECRET || "no token";
if (!token) {
  throw new Error("Missing JWT secret"); // throw an error if JWT secret is not defined in the environment variables.
}
export function createToken(_id: string): string {
  return jwt.sign({ id: User.id }, token, {
    expiresIn: "2d",
  }); // create JWT token
}
