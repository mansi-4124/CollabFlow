import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
export async function hashData(data: string): Promise<string> {
  if (!data) throw new Error("No data provided to hash");
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
}

export async function generateJwtToken(userId: string, email: string) {
  const token = await jwt.sign({ userId, email }, JWT_SECRET!, {
    expiresIn: "7d",
  });
  return token;
}

export async function compareHash(data: string, hashedData: string) {
  return await bcrypt.compare(data, hashedData);
}

export async function getUserFromToken(token: string) {
  const decoded: any = jwt.verify(token, JWT_SECRET);
  return { email: decoded.email, userId: decoded.userId };
}
