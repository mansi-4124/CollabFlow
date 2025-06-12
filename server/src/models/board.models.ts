import mongoose, { Schema } from "mongoose";
import { IBoard } from "../types/board.types";

const boardSchema = new Schema<IBoard>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
          enum: ["admin", "member", "owner"],
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    tags: [{ type: String }],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    deadline: { type: Date },
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
  },
  { timestamps: true }
);

export const BoardModel = mongoose.model<IBoard>("Board", boardSchema);

export class BoardOperations {
  static async createBoard(data: {
    title: string;
    description?: string;
    project: string;
    teamLead?: string;
    members?: string[];
    tags?: string[];
    priority?: "low" | "medium" | "high";
    deadline?: Date;
  }) {
    const board = new BoardModel({
      ...data,
      status: "active",
    });
    return await board.save();
  }

  static async getBoardsByProject(projectId: string) {
    return await BoardModel.find({ project: projectId }).populate(
      "teamLead members"
    );
  }

  static async getBoardsByUser(userId: string) {
    return await BoardModel.find({
      $or: [{ teamLead: userId }, { members: userId }],
    }).populate("teamLead members");
  }

  static async getBoardById(boardId: string) {
    return await BoardModel.findById(boardId).populate(
      "project teamLead members columns.columnId"
    );
  }

  static async updateBoard(
    boardId: string,
    updates: Partial<Omit<IBoard, "_id" | "project" | "columns">>
  ) {
    return await BoardModel.findByIdAndUpdate(boardId, updates, { new: true });
  }

  static async deleteBoard(boardId: string) {
    return await BoardModel.findByIdAndDelete(boardId);
  }

  static async deleteBoardByProject(projectId: string) {
    const boards = await BoardModel.find({ project: projectId }).select("_id");
    const boardIds = boards.map((b) => b._id);
    await BoardModel.deleteMany({ _id: { $in: boardIds } });
    return boardIds;
  }

  static async addMember(
    boardId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ) {
    return await BoardModel.findByIdAndUpdate(
      boardId,
      { $addToSet: { members: { userId, role } } },
      { new: true }
    );
  }

  static async removeMember(boardId: string, userId: string) {
    return await BoardModel.findByIdAndUpdate(
      boardId,
      { $pull: { members: userId } },
      { new: true }
    );
  }

  static async addColumn(boardId: string, columnId: string) {
    return await BoardModel.findByIdAndUpdate(
      boardId,
      {
        $push: {
          columns: columnId,
        },
      },
      { new: true }
    );
  }

  static async removeColumn(boardId: string, columnId: string) {
    return await BoardModel.findByIdAndUpdate(
      boardId,
      { $pull: { columns: { columnId } } },
      { new: true }
    );
  }
}
