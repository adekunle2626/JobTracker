import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/database";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middleware/errorHandler";

const swaggerFile = require("../swagger-output.json");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api", authRoutes);
app.use("/api", applicationRoutes);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Job Tracker is running" });
});

app.use(errorHandler); // must be last: catches errors thrown by any route above

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
