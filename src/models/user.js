import bcrypt from "bcrypt";
import { pool } from "../utils/dbConfig.js";
class User {
  constructor(id, username, email, password, role = "user") {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async comparePassword(passwod, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async addUser(username, email, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (username,email,password,role) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [username, email, password, role];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const res = await pool.query(query, values);
    return res.rows[0]; // Search existing email
  }

  static async findByname(name) {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [name];
    const res = await pool.query(query, values);
    return res.rows[0]; // Search existing username
  }
}

export default User;
