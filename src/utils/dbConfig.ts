import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hzfybgmswzirxvuhbopz.supabase.co";
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;
if (supabaseKey !== undefined) {
  const supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.error(
    "No se ha definido la llave de supabase en las variables de entorno"
  );
}

const port: number | undefined =
  process.env.PORT !== undefined ? parseInt(process.env.PORT, 10) : undefined;
//config the database connection
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port,
});

//connect to the database
export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to database successfully");
  } catch (err) {
    console.log("Unableto connect to database", err);
  }
};
