import mongoose, { Types } from "mongoose";
import { Model, model, Schema } from "mongoose";
import { Request, Response } from "express";
import { schema, IUser } from "../Model/UserModel";
const User = model<IUser>("User", schema);
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

interface User {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const loginAuth = async function (email: string, password: string) {
  const user = await User.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const signToken = (id: string) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(`${process.env.JWT_EXPIRES_IN}`) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = "";

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await loginAuth(email, password);
    console.log(user);

    if (user) {
      createSendToken(user, 200, res);
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Login failed",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();

  createSendToken(user, 201, res);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  console.log(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
