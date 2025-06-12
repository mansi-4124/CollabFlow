import { Types } from "mongoose";
interface IMember {
  user: Types.ObjectId;
  role: "owner" | "admin" | "member";
}
export interface IBoard {
  _id: string;
  title: string;
  description: string;
  project: Types.ObjectId;
  teamLead?: Types.ObjectId;
  members?: IMember[];
  status?: "active" | "archived";
  tags?: string[];
  priority?: "low" | "medium" | "high";
  deadline?: Date;
  columns?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
