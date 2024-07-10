import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001; // default port

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`); // conection with the server suceessfully made.
});
