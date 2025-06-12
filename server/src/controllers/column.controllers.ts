import { Request, Response } from "express";
import { ColumnService } from "../services/column.services";
import { BoardService } from "../services/board.services";

export const createColumnController = async (req: Request, res: Response) => {
  try {
    const { name, board, position } = req.body;
    const column = await ColumnService.createColumn({ name, board, position });
    res.status(201).json({ message: "Column created", column });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Create column failed" });
  }
};

export const getColumnsByBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId } = req.params;
    const columns = await ColumnService.getColumnsByBoard(boardId);
    res.status(200).json(columns);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Fetch failed" });
  }
};

export const updateColumnController = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    const updates = req.body;
    const updated = await ColumnService.updateColumn(columnId, updates);
    res.status(200).json({ message: "Column updated", column: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Update failed" });
  }
};

export const deleteColumnController = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    const deleted = await ColumnService.deleteColumn(columnId);
    res.status(200).json({ message: "Column deleted", column: deleted });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Delete failed" });
  }
};

export const bulkUpdateController = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    const { position } = req.body;
    const updatedColumns = await ColumnService.reorderColumns(
      columnId,
      position
    );
    res
      .status(200)
      .json({ message: "Columns order updates", columns: updatedColumns });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Bulk update failed" });
  }
};
