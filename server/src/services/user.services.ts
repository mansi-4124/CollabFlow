import { ProjectOperations } from "../models/project.models";
import { UserOperations } from "../models/user.models";
import {
  IGoogleAuth,
  IUser,
  IUserLogin,
  IUserSignup,
} from "../types/user.types";
import { generatePayload } from "../utils/googleAuth.utils";
import { compareHash, generateJwtToken, hashData } from "../utils/jwt.utils";

export class AuthService {
  //SignUp
  static async signup({ name, email, password }: IUserSignup) {
    const existingUser = await UserOperations.getUserByEmail(email);
    if (existingUser) throw new Error("User already exists");
    const hashedPassword = await hashData(password);
    const user = await UserOperations.createUser({
      name,
      email,
      password: hashedPassword,
    });
    const token = await generateJwtToken(user._id, user.email);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  //Login
  static async login({ email, password }: IUserLogin) {
    const user = await UserOperations.getUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    const isMatch = await compareHash(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    const token = await generateJwtToken(user._id, user.email);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  //Google Signup
  static async googleSignup({ idToken }: IGoogleAuth) {
    const {
      sub: googleId,
      email,
      given_name: name,
    } = await generatePayload(idToken);
    const existingUser = await UserOperations.getUserByEmail(email as string);
    if (existingUser) throw new Error("User already exists");
    const user = await UserOperations.createUser({
      name,
      email,
      googleId,
    });
    const token = await generateJwtToken(user._id, user.email);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        avatar: user.avatar,
      },
    };
  }

  //Google Login
  static async googleLogin({ idToken }: IGoogleAuth) {
    const { sub: googleId, email } = await generatePayload(idToken);
    const user = await UserOperations.getUserByEmail(email as string);
    if (!user) throw new Error("Google Account not registered");
    const token = await generateJwtToken(user._id, user.email);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        avatar: user.avatar,
      },
    };
  }

  static async getUserByEmail(email: string) {
    const user = await UserOperations.getUserByEmail(email);
    return {
      user,
    };
  }
  static async searchUserByEmail(query: string) {
    const users = await UserOperations.searchUserByEmail(query);
    return {
      users,
    };
  }

  static async getUserProjects(userId: string) {
    return await ProjectOperations.getAllProjectsByUser(userId);
  }
}
