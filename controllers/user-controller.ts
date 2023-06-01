import { Request, Response } from "express";
import prisma from "../database/config";
import { User } from "@prisma/client";

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // user with type User
    
    const user = await prisma.user.findUnique({
      where: {id},
      select :{
        id: true,
        name: true,
        email: true,
        avatarImg: true,
        postDonasi: true,
        postBlog: true,
        savedPost: true,
        savedBlog: true,
      }
    });



    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const avatarImg = req.file?.path;
  const baseUrl = req.protocol + "://" + req.get("host");

  // avatar image path
  const avatarImgPath = baseUrl + "/uploads/img/" + req.file?.filename;

  // const defaultAvatarImg = "https://i.imgur.com/6VBx3io.png";

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        avatarImg: avatarImgPath,
      },
    });
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { getUser, updateUser };
