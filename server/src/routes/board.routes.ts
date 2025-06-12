import express from "express";
import {
  createBoardController,
  getBoardsByProjectController,
  getBoardsByUserController,
  getBoardByIdController,
  updateBoardController,
  deleteBoardController,
  addBoardMemberController,
  removeBoardMemberController,
} from "../controllers/board.controllers";
import { verifyToken } from "../middlewares/auth.middlewares";
import { checkRole } from "../middlewares/role.middlewares";

export const router = express.Router();

router.post("/", verifyToken, createBoardController);
router.get("/project/:projectId", verifyToken, getBoardsByProjectController);
router.get("/user/:userId", verifyToken, getBoardsByUserController);
router.get("/:boardId", verifyToken, getBoardByIdController);
router.patch(
  "/:boardId",
  verifyToken,
  checkRole("board", ["owner", "admin"]),
  updateBoardController
);
router.delete(
  "/:boardId",
  verifyToken,
  checkRole("board", ["owner", "admin"]),
  deleteBoardController
);
router.patch(
  "/:boardId/members/add",
  verifyToken,
  checkRole("board", ["owner", "admin"]),
  addBoardMemberController
);
router.patch(
  "/:boardId/members/remove",
  verifyToken,
  checkRole("board", ["owner", "admin"]),
  removeBoardMemberController
);
