import { Request, Response, NextFunction } from "express";
import { ProjectOperations } from "../models/project.models";
import { BoardOperations } from "../models/board.models";
import mongoose from "mongoose";

type ResourceType = "project" | "board";
type Role = "owner" | "admin" | "member";

export const checkRole =
  (resourceType: ResourceType, requiredRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const userId = req.user.userId;
        const resourceId =
          req.params.projectId ||
          req.params.boardId ||
          req.body.project ||
          req.body.board;

        if (!mongoose.Types.ObjectId.isValid(resourceId)) {
          res.status(400).json({ message: "Invalid resource ID" });
        }

        let resource;
        if (resourceType === "project") {
          resource = await ProjectOperations.getProjectById(resourceId);
        } else if (resourceType === "board") {
          resource = await BoardOperations.getBoardById(resourceId);
        }

        if (!resource) {
          res.status(404).json({ message: `${resourceType} not found` });
        }
        if (resource) {
          if (resource.members) {
            const memberInfo = resource.members.find(
              (m: any) => m.user.toString() === userId
            );

            if (!memberInfo || !requiredRoles.includes(memberInfo.role)) {
              res.status(403).json({ message: "Access denied" });
            }

            next();
          }
        }
      }
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
