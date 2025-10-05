import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT_NUMBER || 8000;

app.use(express.json());
app.use(cookieParser());

// CORS for cross-port requests
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies to be sent
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
});
