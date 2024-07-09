import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/utils/dbConfig.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import authRouter from "./src/routes/authRoutes.js";
import dashboardRouter from "./src/routes/kanbanRoutes.js";
import profileRouter from "./src/routes/profileRoute.js";

import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Kanban API",
      version: "1.0.0",
      description: "API for managing a Kanban board",
    },
    servers: [{ url: "https://hzfybgmswzirxvuhbopz.supabase.co" }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express(); // initializes express instance

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // setup Swagger UI
app.use(express.json()); // enables json files parsing
app.use(cookieParser()); // enables cookie parsing
connectDB(); // connects to database

//middleware for error handling
app.use(errorHandler);

//rutes
app.use("/api/auth", authRouter); // use the authorization route for the users
app.use("/api/kanban", dashboardRouter); // use the authorization route for the dashboard
app.use("/api/profile", profileRouter); // use the authorization route for the user profile

export default app;
