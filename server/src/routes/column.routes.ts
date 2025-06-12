import express from "express";
import {
  createColumnController,
  getColumnsByBoardController,
  updateColumnController,
  deleteColumnController,
  bulkUpdateController,
} from "../controllers/column.controllers";
import { verifyToken } from "../middlewares/auth.middlewares";
import { checkRole } from "../middlewares/role.middlewares";

export const router = express.Router();

router.post("/", verifyToken, createColumnController);

router.get("/board/:boardId", verifyToken, getColumnsByBoardController);

router.patch("/:columnId", verifyToken, updateColumnController);

router.patch("/reorder/:columnId", verifyToken, bulkUpdateController);

router.delete("/:columnId", verifyToken, deleteColumnController);

