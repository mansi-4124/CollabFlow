import { BoardOperations } from "../models/board.models";
import { ColumnOperations } from "../models/column.models";
import { UserOperations } from "../models/user.models";
import { IBoard } from "../types/board.types";

export class BoardService {
  static async createBoard(data: any) {
    if (!data.title || !data.description || !data.project)
      throw new Error("All fields required");
    return await BoardOperations.createBoard(data);
  }

  static async getBoardsByProject(projectId: string) {
    return await BoardOperations.getBoardsByProject(projectId);
  }

  static async getBoardsByUser(userId: string) {
    return await BoardOperations.getBoardsByUser(userId);
  }

  static async getBoardById(boardId: string) {
    return await BoardOperations.getBoardById(boardId);
  }

  static async updateBoard(
    boardId: string,
    updates: Partial<Omit<IBoard, "_id" | "project" | "columns">>
  ) {
    return await BoardOperations.updateBoard(boardId, updates);
  }

  static async deleteBoard(boardId: string) {
    return await BoardOperations.deleteBoard(boardId);
  }

  static async deleteBoardByProject(projectId: string) {
    const boardIds = await BoardOperations.deleteBoardByProject(projectId);
    await ColumnOperations.deleteColumnByBoard(boardIds);
    return boardIds;
  }

  static async addMember(
    boardId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ) {
    return await BoardOperations.addMember(boardId, userId, role);
  }

  static async removeMember(boardId: string, userId: string) {
    return await BoardOperations.removeMember(boardId, userId);
  }

  static async addColumnMeta(boardId: string, columnId: string, name: string) {
    return await BoardOperations.addColumn(boardId, columnId);
  }

  static async removeColumnMeta(boardId: string, columnId: string) {
    return await BoardOperations.removeColumn(boardId, columnId);
  }
}
