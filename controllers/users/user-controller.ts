import { Request, Response } from "express";
import prisma from "../../database/config";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { imgPathGenerator } from "../../utils/helpers";
import { uploadFirebase } from "../../middleware/upload-firebase";

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // user with type User

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        avatarImg: true,
        postDonasi: true,
        postBlog: true,
        savedPost: {
          select: {
            post: true,
          }
        },
        savedBlog: {
          select: {
            blog: true,
          }
        },
      },
    });

    if (!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // let imgPath = imgPathGenerator(req, res);
  const imgUrl = await uploadFirebase(req.file)

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        avatarImg: imgUrl,
        password: req.body.password,
        profession: req.body.profession,
      },
    });
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: error.message });
    }
  }
};

export { getUser, updateUser };
