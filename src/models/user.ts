import bcrypt from "bcrypt";
import { pool } from "../utils/dbConfig";

class User {
  id: number | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  role: string | undefined;
  static id: any;
  
  static async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async addUser(
    username: string,
    email: string,
    password: string,
    role = "user"
  ) {
    const query =
      "INSERT INTO users (username,email,password,role) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [username, email, password, role];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async findByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const res = await pool.query(query, values);
    return res.rows[0]; // Search existing email
  }

  static async findByname(name: string) {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [name];
    const res = await pool.query(query, values);
    return res.rows[0]; // Search existing username
  }
}

export default User;