import { Request, Response } from "express";
import { AuthService } from "../services/user.services";
import { getUserFromToken } from "../utils/jwt.utils";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      res.status(400).json({ message: "All fields are required" });

    const result = await AuthService.signup({ name, email, password });
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Signup successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      res.status(400).json({ message: "All fields are required" });

    const result = await AuthService.login({ email, password });
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Login failed" });
  }
};

export const googleSignupController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) res.status(400).json({ message: "Google Id Token required" });
    const result = await AuthService.googleSignup({ idToken });
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Google signup successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Google signup failed" });
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) res.status(400).json({ message: "Google Id Token required" });
    const result = await AuthService.googleLogin({ idToken });
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Google login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Google login failed" });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

export const finduserByEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const email = req.params.email;
    if (!email)
      res.status(400).json({ message: "Email must be passed in params" });
    const result = await AuthService.getUserByEmail(email);
    res.status(200).json({
      message: "User found",
      user: result.user,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Unable to fetch user by email" });
  }
};

export const searchUserByEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const query = req.params.q;
    if (!query)
      res.status(400).json({ message: "Query must be passed in params" });
    const result = await AuthService.searchUserByEmail(query);
    res.status(200).json({
      message: "Users found",
      users: result.users,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Unable to fetch user by email" });
  }
};

export const getUserProjectsController = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.cookies?.token;
    const { userId } = await getUserFromToken(token);
    const projects = await AuthService.getUserProjects(userId as string);
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Projects not found" });
  }
};
