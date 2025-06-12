import mongoose from "mongoose";
import { BoardOperations } from "../models/board.models";
import { ColumnOperations } from "../models/column.models";
import { IColumn } from "../types/column.types";

export class ColumnService {
  static async createColumn(data: {
    name: string;
    board: string;
    position?: number;
  }) {
    if (!data.name || !data.board || !data.position)
      throw new Error("All fields required");
    const column = await ColumnOperations.createColumn(data);
    await BoardOperations.addColumn(column.board.toString(), column._id);
    return column;
  }

  static async getColumnsByBoard(boardId: string) {
    return await ColumnOperations.getColumnsByBoard(boardId);
  }

  static async updateColumn(
    columnId: string,
    updates: Partial<Omit<IColumn, "_id" | "board">>
  ) {
    return await ColumnOperations.updateColumn(columnId, updates);
  }

  static async deleteColumn(columnId: string) {
    const column = await ColumnOperations.deleteColumn(columnId);
    if (column)
      await BoardOperations.removeColumn(column.board.toString(), column._id);
    return column;
  }

  static async reorderColumns(columnId: string, newPosition: number) {
    const draggedColumn = await ColumnOperations.getColumnById(columnId);
    if (!draggedColumn) {
      throw new Error(`Column with ID ${columnId} not found.`);
    }

    const boardId = draggedColumn.board.toString();
    const oldPosition = draggedColumn.position;

    // 1. Get all columns of the same board, sorted by position
    const allColumns = await ColumnOperations.getColumnsByBoard(boardId);
    const sorted = allColumns.sort((a, b) => a.position - b.position);

    // 2. Remove dragged column
    const remainingColumns = sorted.filter(
      (c) => c._id.toString() !== columnId
    );

    // 3. Clamp new position
    const clampedPosition = Math.max(
      0,
      Math.min(newPosition, remainingColumns.length)
    );

    // 4. Insert dragged column at new position
    remainingColumns.splice(clampedPosition, 0, draggedColumn);
    console.log(remainingColumns);
    // 5. Prepare bulk operations
    const minimalColumns = remainingColumns.map((col, index) => ({
      _id: col._id,
      position: index,
    }));
    const result = await ColumnOperations.bulkUpdate(minimalColumns);
    console.log(minimalColumns);
    // 6. Apply changes
    try {
      const result = await ColumnOperations.bulkUpdate(minimalColumns);
      console.log("Bulk update result:", result);
      return result;
    } catch (err: any) {
      console.error("Error in bulk update:", err.message);
      throw err;
    }
  }
}
