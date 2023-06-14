import { Request, Response } from "express";
import prisma from "../../database/config";
import { createJWT, hashPassword } from "../../utils/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uploadFirebase } from "../../middleware/upload-firebase";

const register = async (req: any, res: any) => {
  try {
    const { name, email, password, profession } = req.body;

    // find if user already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: true,
        message: "User already exists",
      });
    }

    // const baseUrl = req.protocol + "://" + req.get("host");

    // let avatarImgPath: string | undefined;
    // // avatar image path
    // if (req.file) {
    //   avatarImgPath = baseUrl + "/uploads/img/" + req.file?.filename;
    // }

    // // const defaultAvatarImg = "https://i.imgur.com/6VBx3io.png";
    // const defaultAvatarImg = baseUrl + "/uploads/default-avatar.png";
    // const pathToAvatarImg = avatarImg ? avatarImg.path : defaultAvatarImg;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        profession,
        avatarImg: await uploadFirebase(req.file) || "https://www.w3schools.com/howto/img_avatar.png",
        password: await hashPassword(password),
      },
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarImg: user.avatarImg,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userData,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Please provide valid email and password",
      });
    }
    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User does not exist",
      });
    }

    // check if password is correct
    // const validPassword = await comparePasswords(password, user.password);
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid password",
      });
    }

    const token = createJWT(user);

    // set authorization header

    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //     avatarImg: user.avatarImg,
    //   },
    //   process.env.JWT_SECRET as string,
    //   {
    //     expiresIn: "1m",
    //   }
    // );

    const { password: userPassword, ...userData } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        // sameSite: "none",
        // secure: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        user: userData,
        token,
      });

    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({
    //     message: "User logged in successfully",
    //     user: userData,
    //     token,
    //   });

    // res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newToken = createJWT(user);

    res
      .cookie("access_token", newToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Token refreshed", token: newToken });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const signout = async (req: Request, res: Response) => {
  // clear cookie
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    })
    .status(202)
    .json({ message: "User signed out" });
};

export { register, login, signout, refreshToken };
