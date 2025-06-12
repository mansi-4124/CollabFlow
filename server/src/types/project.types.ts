import { Types } from "mongoose";
interface IMember {
  user: Types.ObjectId;
  role: "owner" | "admin" | "member";
}
export interface IProject {
  _id: string;
  title: string;
  description: string;
  owner: Types.ObjectId;
  members?: IMember[];
  category: "Development" | "Design" | "Marketing" | "Product" | "HR" | "Other";
  status: "not-started" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  tags?: string[];
  deadline?: Date;
  starredBy?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectCreate
  extends Omit<IProject, "_id" | "createdAt" | "updatedAt"> {}
