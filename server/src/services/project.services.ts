import { BoardModel, BoardOperations } from "../models/board.models";
import { ProjectOperations } from "../models/project.models";
import { UserOperations } from "../models/user.models";
import { IProject } from "../types/project.types";

export class ProjectService {
  static async createProject(data: IProject) {
    if (!data.title || !data.description || !data.owner)
      throw new Error("All fields required");
    return await ProjectOperations.createProject(data);
  }

  static async updateProject(projectId: string, updates: Partial<IProject>) {
    return await ProjectOperations.updateProject(projectId, updates);
  }

  static async deleteProject(projectId: string) {
    await BoardOperations.deleteBoardByProject(projectId);
    return await ProjectOperations.deleteProject(projectId);
  }

  static async getProjectById(projectId: string) {
    return await ProjectOperations.getProjectById(projectId);
  }
}
