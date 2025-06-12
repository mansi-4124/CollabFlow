//User model with methods to perform operations on it

import mongoose, { Schema } from "mongoose";
import { IUser, IUserGoogleSignup, IUserSignup } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export class UserOperations {
  static async createUser(data: IUserSignup | IUserGoogleSignup) {
    const user = new UserModel(data);
    return user.save();
  }

  static async getAllUsers() {
    return await UserModel.find();
  }

  static async getUserById(userId: string) {
    return await UserModel.findById(userId);
  }
  static async getUserByEmail(email: string) {
    return await UserModel.findOne({ email });
  }

  static async searchUserByEmail(query: string) {
    return await UserModel.find({
      email: { $regex: `^${query}`, $options: `i` },
    });
  }

  static async updateUser(userId: string, updates: Partial<IUser>) {
    if (updates.password) delete updates.password;
    return await UserModel.findByIdAndUpdate(userId, updates, { new: true });
  }

  static async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId);
  }
}
