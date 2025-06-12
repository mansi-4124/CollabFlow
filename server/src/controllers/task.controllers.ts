import { Request, Response } from "express";
import { TaskService } from "../services/task.services";

// Create task
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.createTask(req.body);
    res.status(201).json({ message: "Task created", task });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Task creation failed" });
  }
};

// Get all tasks by board
export const getTasksByBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks = await TaskService.getTasksByBoard(req.params.boardId);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Tasks not found" });
  }
};

// Get single task
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.getTaskById(req.params.taskId);
    res.status(200).json(task);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Task not found" });
  }
};

// Update task
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const updated = await TaskService.updateTask(req.params.taskId, req.body);
    res.status(200).json({ message: "Task updated", updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Task update failed" });
  }
};

// Delete task
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    await TaskService.deleteTask(req.params.taskId);
    res.status(200).json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Task deletion failed" });
  }
};

// Add comment
export const addCommentController = async (req: Request, res: Response) => {
  try {
    const { userId, text } = req.body;
    const comment = await TaskService.addComment(
      req.params.taskId,
      userId,
      text
    );
    res.status(201).json({ message: "Comment added", comment });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to add comment" });
  }
};

// Add attachment (assumes file uploaded using middleware)
export const addAttachmentController = async (req: Request, res: Response) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const attachment = await TaskService.addAttachment(req.params.taskId, {
      fileName: req.file.originalname,
      fileUrl: (req.file as any).path,
      publicId: (req.file as any).filename,
      uploadedBy: req.body.userId,
    });

    res.status(201).json({ message: "Attachment added", attachment });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Attachment failed" });
  }
};

// Delete attachment
export const deleteAttachmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const updatedTask = await TaskService.deleteAttachment(
      req.params.taskId,
      req.params.attachmentId,
      req.params.publicId
    );
    res.status(200).json({ message: "Attachment deleted", updatedTask });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Failed to delete attachment" });
  }
};

export const bulkUpdateController = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const { tasks } = req.body;
    const updatedTasks = await TaskService.bulkUpdate(boardId, tasks);
    res
      .status(200)
      .json({ message: "Tasks updated successfully", columns: updatedTasks });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Bulk update failed" });
  }
};
