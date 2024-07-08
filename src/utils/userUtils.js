import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Verify the existence of email addresses or usernames in the database
export const checkExistence = async (email, username) => {
  // verify if the username already exists
  const existingUser = await User.findByname({ username });
  if (existingUser)
    return res.status(400).json({ message: "Username already exists" });

  // verify if the email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res.status(400).json({ message: "Email already exists" });
};

export const createToken = (id) => {
  return jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  }); // create JWT token
};

// password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
export const passwordStrength = (password) => {
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
};
