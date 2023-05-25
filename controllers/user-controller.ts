import { Request, Response } from "express";
import prisma from "../database/config";
import bcrypt from "bcrypt";
import { comparePasswords, createJWT, hashPassword } from "../utils/auth";
import jwt from "jsonwebtoken";

const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    const { avatarImg } = req.body;

    console.log(req.file);

    // const { avatarImg } = req.file;

    // base url
    const baseUrl = req.protocol + "://" + req.get("host");

    // avatar image path
    // const avatarImgPath = baseUrl + "/uploads/avatar/" + req.file.filename;

    const defaultAvatarImg = "https://i.imgur.com/6VBx3io.png";
    // const pathToAvatarImg = avatarImg ? avatarImg.path : defaultAvatarImg;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatarImg: avatarImg || defaultAvatarImg,
        password: await hashPassword(password),
      },
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarImg: user.avatarImg,
    };
    res.status(201).json({ userData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if password is correct
    // const validPassword = await comparePasswords(password, user.password);
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // const token = createJWT(user);
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ user });

    // res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const signout = async (req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ message: "User signed out" });
};

export { register, login, signout };
