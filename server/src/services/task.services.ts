import { TaskOperations } from "../models/task.model";
import cloudinary from "../config/cloudinary.config";
import { ITask } from "../types/task.types";

export class TaskService {
  static async createTask(data: any) {
    return await TaskOperations.createTask(data);
  }

  static async getTaskById(taskId: string) {
    return await TaskOperations.getTaskById(taskId);
  }

  static async updateTask(taskId: string, updates: Partial<any>) {
    return await TaskOperations.updateTask(taskId, updates);
  }

  static async deleteTask(taskId: string) {
    const task = await TaskOperations.getTaskById(taskId);
    if (!task) throw new Error("Task not found");

    for (const attachment of task.attachments) {
      if (attachment.publicId) {
        await cloudinary.uploader.destroy(attachment.publicId);
      }
    }

    return await TaskOperations.deleteTask(taskId);
  }

  static async addComment(taskId: string, userId: string, text: string) {
    return await TaskOperations.addCommentToTask(taskId, userId, text);
  }

  static async addAttachment(
    taskId: string,
    data: {
      fileName: string;
      fileUrl: string;
      publicId: string;
      uploadedBy: string;
    }
  ) {
    return await TaskOperations.addAttachmentToTask(taskId, data);
  }

  static async deleteAttachment(
    taskId: string,
    attachmentId: string,
    publicId: string
  ) {
    if (publicId) await cloudinary.uploader.destroy(publicId);
    return await TaskOperations.deleteAttachmentFromTask(taskId, attachmentId);
  }

  static async getTasksByBoard(boardId: string) {
    return await TaskOperations.getTasksByBoard(boardId);
  }

  static async bulkUpdate(boardId: string, tasks: Partial<ITask>[]) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error("No updates");
    }
    const updatedData = await TaskOperations.bulkUpdate(boardId, tasks);
    return updatedData;
  }
}
