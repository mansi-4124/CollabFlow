import { Request, Response } from "express";
import { ProjectService } from "../services/project.services";
import mongoose from "mongoose";

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Project creation failed" });
  }
};

export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const updated = await ProjectService.updateProject(projectId, req.body);
    res.status(200).json({ message: "Project updated successfully", updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Project update failed" });
  }
};

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    await ProjectService.deleteProject(projectId);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Project deletion failed" });
  }
};

export const getProjectByIdController = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.getProjectById(req.params.projectId);
    res.status(200).json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Project not found" });
  }
};
