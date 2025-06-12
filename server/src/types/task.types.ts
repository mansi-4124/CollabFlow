import { Document, Types } from "mongoose";

export interface IComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  timestamp: Date;
}

export interface IAttachment {
  _id?: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  publicId: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: Types.ObjectId[];
  board: Types.ObjectId;
  column: Types.ObjectId;
  project: Types.ObjectId;
  labels?: string[];
  deadline?: Date;
  attachments: IAttachment[];
  comments: IComment[];
  createdBy: Types.ObjectId;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}
