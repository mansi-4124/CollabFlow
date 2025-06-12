interface IMember {
  user: string;
  role: "owner" | "admin" | "member";
}
export interface IBoard {
  _id: string;
  title: string;
  description: string;
  project: string;
  teamLead?: string;
  members?: IMember[];
  status?: "active" | "archived";
  tags?: string[];
  priority?: "low" | "medium" | "high";
  deadline?: Date;
  columns?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
