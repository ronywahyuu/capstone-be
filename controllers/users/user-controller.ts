import { Request, Response } from "express";
import prisma from "../../database/config";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { imgPathGenerator } from "../../utils/helpers";
import { uploadFirebase } from "../../middleware/upload-firebase";
import { hashPassword } from "../../utils/auth";
import { deleteFiles } from "../../utils/delete-files";

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

const updateUser = async (req: any, res: any) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // let imgPath = imgPathGenerator(req, res);
  
  try {

    if(req.user.id !== id){
      return res.status(401).json({ message: "You are not authorized to update this user" });
    }

    // delee old image
    if (req.file) {
      await deleteFiles(req.user.avatarImg ?? "");
    }

    const imgUrl = await uploadFirebase(req.file)
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        ...(imgUrl && { avatarImg: imgUrl }),
        ...(password && { password: await hashPassword(password) }),
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
