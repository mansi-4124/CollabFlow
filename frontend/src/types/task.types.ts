export interface IComment {
  _id?: string;
  user: string;
  text: string;
  timestamp: Date;
}

export interface IAttachment {
  _id?: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string[];
  board: string;
  column: string;
  project: string;
  labels?: string[];
  deadline?: Date;
  attachments: IAttachment[];
  comments: IComment[];
  createdBy: string;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}
