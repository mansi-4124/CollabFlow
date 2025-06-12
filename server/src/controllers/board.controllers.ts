// board.controllers.ts
import { Request, Response } from "express";
import { BoardService } from "../services/board.services";

export const createBoardController = async (req: Request, res: Response) => {
  try {
    const board = await BoardService.createBoard(req.body);
    res.status(201).json({ message: "Board created", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Board creation failed" });
  }
};

export const getBoardsByProjectController = async (
  req: Request,
  res: Response
) => {
  try {
    const boards = await BoardService.getBoardsByProject(req.params.projectId);
    res.status(200).json(boards);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getBoardsByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const boards = await BoardService.getBoardsByUser(req.params.userId);
    res.status(200).json(boards);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getBoardByIdController = async (req: Request, res: Response) => {
  try {
    const board = await BoardService.getBoardById(req.params.boardId);
    res.status(200).json(board);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBoardController = async (req: Request, res: Response) => {
  try {
    const board = await BoardService.updateBoard(req.params.boardId, req.body);
    res.status(200).json({ message: "Board updated", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBoardController = async (req: Request, res: Response) => {
  try {
    await BoardService.deleteBoard(req.params.boardId);
    res.status(200).json({ message: "Board deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addBoardMemberController = async (req: Request, res: Response) => {
  try {
    const board = await BoardService.addMember(
      req.params.boardId,
      req.body.userId,
      req.body.role
    );
    res.status(200).json({ message: "Member added", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeBoardMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const board = await BoardService.removeMember(
      req.params.boardId,
      req.body.userId
    );
    res.status(200).json({ message: "Member removed", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addColumnMetaController = async (req: Request, res: Response) => {
  try {
    const { columnId, name } = req.body;
    const board = await BoardService.addColumnMeta(
      req.params.boardId,
      columnId,
      name
    );
    res.status(200).json({ message: "Column added", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeColumnMetaController = async (
  req: Request,
  res: Response
) => {
  try {
    const board = await BoardService.removeColumnMeta(
      req.params.boardId,
      req.body.columnId
    );
    res.status(200).json({ message: "Column removed", board });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
