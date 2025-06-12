import mongoose, { Schema } from "mongoose";
import { IColumn } from "../types/column.types";
import { BoardModel, BoardOperations } from "./board.models";

const columnSchema = new Schema<IColumn>(
  {
    name: { type: String, required: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ColumnModel = mongoose.model<IColumn>("Column", columnSchema);

export class ColumnOperations {
  static async createColumn(data: {
    name: string;
    board: string;
    position?: number;
  }) {
    const column = new ColumnModel(data);
    const saved = await column.save();
    return saved;
  }

  static async getColumnsByBoard(boardId: string) {
    return await ColumnModel.find({ board: boardId })
      .sort({ position: 1 })
      .lean<IColumn[]>();
  }
  static async getColumnById(columnId: string) {
    return await ColumnModel.findOne({ _id: columnId }).lean<IColumn>();
  }

  static async updateColumn(columnId: string, updates: Partial<IColumn>) {
    return await ColumnModel.findByIdAndUpdate(columnId, updates, {
      new: true,
    });
  }

  static async deleteColumn(columnId: string) {
    const column = await ColumnModel.findByIdAndDelete(columnId);
    return column;
  }

  static async deleteColumnByBoard(boardId: string[]) {
    const columns = await ColumnModel.deleteMany({ board: { $in: boardId } });
    return columns;
  }

  static async bulkUpdate(columns: any) {
    const bulkOperations = columns.map((col: any) => ({
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(col._id),
        },
        update: { $set: { position: col.position } },
      },
    }));
    const result = await ColumnModel.bulkWrite(bulkOperations);
    return result;
  }
}
