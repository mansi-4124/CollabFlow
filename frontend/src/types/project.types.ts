interface IMember {
  user: string;
  role: "owner" | "admin" | "member";
}

export interface IProject {
  _id: string;
  title: string;
  description: string;
  owner: string;
  members?: IMember[];
  category: "Development" | "Design" | "Marketing" | "Product" | "HR" | "Other";
  status: "not-started" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  tags?: string[];
  deadline?: Date;
  starredBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
