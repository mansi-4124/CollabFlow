import express from "express";
import {
  createProjectController,
  updateProjectController,
  deleteProjectController,
  getProjectByIdController,
} from "../controllers/project.controllers";
import { verifyToken } from "../middlewares/auth.middlewares";
import { checkRole } from "../middlewares/role.middlewares";

export const router = express.Router();

router.post("/", verifyToken, createProjectController);
router.patch(
  "/:projectId",
  verifyToken,
  checkRole("project", ["owner"]),
  updateProjectController
);
router.delete(
  "/:projectId",
  verifyToken,
  checkRole("project", ["owner"]),
  deleteProjectController
);
router.get("/:projectId", verifyToken, getProjectByIdController);
