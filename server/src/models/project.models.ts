import mongoose, { Schema } from "mongoose";
import { IProject, IProjectCreate } from "../types/project.types";

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          required: true,
        },
      },
    ],
    category: {
      type: String,
      enum: ["Development", "Design", "Marketing", "Product", "HR", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold"],
      default: "not-started",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: [{ type: String }],
    deadline: { type: Date },
    starredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model<IProject>("Project", projectSchema);

export class ProjectOperations {
  static async createProject(data: IProjectCreate) {
    const project = new ProjectModel(data);
    return await project.save();
  }

  static async getAllProjectsByUser(userId: string) {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    return await ProjectModel.find({
      $or: [
        { owner: objectUserId },
        { members: { $elemMatch: { user: objectUserId } } },
      ],
    });
  }

  static async getProjectById(projectId: string) {
    return await ProjectModel.findById(projectId).populate("owner members");
  }

  static async updateProject(projectId: string, updates: Partial<IProject>) {
    return await ProjectModel.findByIdAndUpdate(projectId, updates, {
      new: true,
    });
  }

  static async deleteProject(projectId: string) {
    return await ProjectModel.findByIdAndDelete(projectId);
  }
}
