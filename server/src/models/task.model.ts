import mongoose, { Schema, Types } from "mongoose";
import { ITask, IComment, IAttachment } from "../types/task.types";

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const attachmentSchema = new Schema<IAttachment>({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User", default: null }], // Optional assignment
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    column: { type: Schema.Types.ObjectId, ref: "Column", required: true }, // Reference to the current column
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true }, // For easier project-level querying
    labels: [{ type: String }],
    deadline: { type: Date, default: null },
    attachments: [attachmentSchema],
    comments: [commentSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderIndex: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("Task", taskSchema);

export class TaskOperations {
  // Create a new task
  static async createTask(data: {
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee?: string;
    board: string;
    column: string;
    project: string;
    createdBy: string;
    orderIndex: number;
    labels?: string[];
    dueDate?: Date;
  }) {
    const task = new TaskModel(data);
    const savedTask = await task.save();
    return savedTask.populate([
      "assignee",
      "createdBy",
      "board",
      "column",
      "project",
    ]);
  }

  static async getTasksByBoard(boardId: string) {
    return await TaskModel.find({ board: boardId }).sort({
      column: 1,
      orderIndex: 1,
    });
  }

  // Get a single task by ID
  static async getTaskById(taskId: string) {
    return await TaskModel.findById(taskId)
      .populate("assignedTo createdBy board column project")
      .populate({
        path: "comments.user",
        select: "name email avatar",
      });
  }

  // Update a task
  static async updateTask(taskId: string, updates: Partial<ITask>) {
    return await TaskModel.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    }).populate(["assignee", "createdBy", "board", "column", "project"]);
  }

  // Delete a task
  static async deleteTask(taskId: string) {
    const task = await TaskModel.findByIdAndDelete(taskId);
    // TODO: If attachments exist, you might want to delete them from Cloudinary here
    return task;
  }

  // Add a comment to a task
  static async addCommentToTask(taskId: string, userId: string, text: string) {
    const comment = {
      user: new Types.ObjectId(userId),
      text,
      timestamp: new Date(),
    };
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { comments: comment } },
      { new: true }
    ).populate({
      path: "comments.user",
      select: "name email",
    });

    if (!updatedTask) return null;
    return updatedTask.comments[updatedTask.comments.length - 1]; // Return the newly added comment
  }

  // Add an attachment to a task (will be called after Cloudinary upload)
  static async addAttachmentToTask(
    taskId: string,
    attachmentData: {
      fileName: string;
      fileUrl: string;
      publicId: string;
      uploadedBy: string;
    }
  ) {
    const newAttachment = { ...attachmentData, uploadedAt: new Date() };
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { attachments: newAttachment } },
      { new: true }
    );
    if (!updatedTask) return null;
    return updatedTask.attachments[updatedTask.attachments.length - 1]; // Return the newly added attachment
  }

  // Delete an attachment from a task
  static async deleteAttachmentFromTask(taskId: string, attachmentId: string) {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $pull: { attachments: { _id: attachmentId } } }, // Pull from array by subdocument ID
      { new: true }
    );
    return updatedTask; // Return the updated task
  }

  // Delete tasks by board ID (e.g., when a board is deleted)
  static async deleteTasksByBoard(boardId: string) {
    // TODO: Before deleting tasks, consider if you need to delete their Cloudinary attachments
    const tasks = await TaskModel.deleteMany({ board: boardId });
    return tasks;
  }

  // Delete tasks by project ID (e.g., when a project is deleted)
  static async deleteTasksByProject(projectId: string) {
    const tasks = await TaskModel.deleteMany({ project: projectId });
    return tasks;
  }

  static async bulkUpdate(boardId: string, tasks: Partial<ITask>[]) {
    const boardObjectId = new mongoose.Types.ObjectId(boardId);

    const bulkOperations = tasks.map((task) => {
      if (!task._id) {
        throw new Error("Task ID is missing for bulk update operation.");
      }
      if (!task.column) {
        throw new Error("Task column ID is missing for bulk update operation.");
      }

      return {
        updateOne: {
          filter: {
            _id: new mongoose.Types.ObjectId(task._id as string),
            board: boardObjectId,
          },
          update: {
            $set: {
              column: task.column,
              orderIndex: task.orderIndex,
            },
          },
        },
      };
    });

    try {
      const result = await TaskModel.bulkWrite(bulkOperations);
      return result;
    } catch (error) {
      console.error("Error in TaskService.bulkUpdate:", error);
      throw error; // Re-throw to propagate the error
    }
  }
}
