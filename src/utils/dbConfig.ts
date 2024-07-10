import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const {
  POSTGRES_URL,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

if (
  !POSTGRES_URL ||
  !POSTGRES_USER ||
  !POSTGRES_HOST ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DATABASE
) {
  throw new Error("Database configuration missing or incorrect.");
}
//config the database connection
const pool = new Pool({
  connectionString: POSTGRES_URL,
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
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
