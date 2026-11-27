import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/database";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middleware/errorHandler";
import dashboardRoutes from "./routes/dashboardRoutes";
import { env } from "./config/env";
import mongoose from "mongoose";
import { Server } from "http";

const swaggerFile = require("../swagger-output.json");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api", authRoutes);
app.use("/api", applicationRoutes);
app.use("/api", dashboardRoutes);

let server: Server;

const PORT = env.port;

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Job Tracker is running" });
});

app.use(errorHandler); // must be last: catches errors thrown by any route above


const startServer = async () => {
  await connectDb();

  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

const shutdown = async () => {
  console.log("Shutting down server...");

  if (!server) {
    await mongoose.connection.close();
    process.exit(0);
  }

  server.close(async (error) => {
    if (error) {
      console.error("Error closing HTTP server:", error);
      process.exit(1);
    }

    console.log("HTTP server closed");

    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      process.exit(1);
    }
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
