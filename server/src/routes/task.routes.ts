import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares";
import parser from "../middlewares/cloudinaryUpload";

import {
  createTaskController,
  getTasksByBoardController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  addCommentController,
  addAttachmentController,
  deleteAttachmentController,
  bulkUpdateController,
} from "../controllers/task.controllers";

export const router = express.Router();

// Task routes
router.post("/", verifyToken, createTaskController);
router.get("/board/:boardId", verifyToken, getTasksByBoardController);
router.get("/:taskId", verifyToken, getTaskByIdController);
router.patch("/:taskId", verifyToken, updateTaskController);
router.patch("/reorder/:boardId", verifyToken, bulkUpdateController);
router.delete("/:taskId", verifyToken, deleteTaskController);

// Comments
router.post("/:taskId/comments", verifyToken, addCommentController);

// Attachments
router.post(
  "/:taskId/attachments",
  verifyToken,
  parser.single("file"),
  addAttachmentController
);
router.delete(
  "/:taskId/attachments/:attachmentId",
  verifyToken,
  deleteAttachmentController
);
