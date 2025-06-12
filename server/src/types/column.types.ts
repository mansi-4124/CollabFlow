import { Types } from "mongoose";

export interface IColumn {
  _id: string;
  name: string;
  board: Types.ObjectId;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
}
