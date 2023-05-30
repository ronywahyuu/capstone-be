import { Request, Response } from "express";
import prisma from "../database/config";

export const getSavedDonasi = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const savedDonasi = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: true,
      },
    });

    res.status(200).json({
      length: savedDonasi.length,
      data: savedDonasi,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavedDonasi = async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  try {
    // if user already saved this post
    const user = await prisma.savedPost.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (user) {
      return res.status(400).json({
        message: "User already saved this post",
      });
    }

    // if post not created yet
    const post = await prisma.postDonasi.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(400).json({
        message: "Post not found",
      });
    }

    const savedDonasi = await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    // trigger update saved count
    await prisma.postDonasi.update({
      where: {
        id: postId,
      },
      data: {
        savedCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      data: savedDonasi,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedDonasi = async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  try {
    // if user already saved this post
    const savedData = await prisma.savedPost.findFirst({
      where: {
        userId,
      },
    });

    if (!savedData) {
      return res.status(400).json({
        message: "Data not found",
      });
    }

    const savedDonasi = await prisma.savedPost.delete({
      where: {
        id,
      },
    });

    // trigger update saved count
    await prisma.postDonasi.update({
      where: {
        id: savedData.postId,
      },
      data: {
        savedCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      data: savedDonasi,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
