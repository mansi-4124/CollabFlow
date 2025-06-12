import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { router as userRouter } from "./routes/user.routes";
import { router as projectRouter } from "./routes/project.routes";
import { router as boardRouter } from "./routes/board.routes";
import { router as columnRouter } from "./routes/column.routes";
import { router as taskRouter } from "./routes/task.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

mongoose
  .connect(MONGO_URI as string)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error connectiong to database : ", err));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/board", boardRouter);
app.use("/column", columnRouter);
app.use("/task", taskRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
