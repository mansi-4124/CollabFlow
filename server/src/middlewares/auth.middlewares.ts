import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserOperations } from "../models/user.models";

const JWT_SECRET = process.env.JWT_SECRET!;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await UserOperations.getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
