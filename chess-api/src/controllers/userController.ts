import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user = await User.create({ username, email, password });

  // user.generateJwtToken();

  return res.status(200).json({
    success: true,
    user,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }
  return res.status(200).json(user);
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findById(id);
  return res.status(200).json(user);
};
