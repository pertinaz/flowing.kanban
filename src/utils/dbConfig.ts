import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASS, DB_PORT } = process.env;

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASS || !DB_PORT) {
  throw Error("Database configutarion missing");
}
//config the database connection
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  ssl: {
    rejectUnauthorized: false, // Required to connect the database
  },
});

//connect to the database
export const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log("Connected to database successfully");
  } catch (err) {
    console.log("Unableto connect to database", err);
    process.exit(1);
  }
};

export default pool;
