import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: string
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({ email: normalizedEmail });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashPassword, role });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return res.status(201).json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    return res
      .status(500)
      .json({ message: "An error occurred. Pls try again later." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const aUser = await User.findOne({ email: normalizedEmail });

    if (!aUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const pass = await bcrypt.compare(password, aUser.password);
    if (!pass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: aUser._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return res.status(200).json({
      token,
      user: { id: String(aUser._id), name: aUser.name, email: aUser.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed." });
  }
};
