import { Request, Response } from "express";
import prisma from "../../database/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getSavedBlog = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const savedBlog = await prisma.savedBlog.findMany({
      where: {
        userId,
      },
      include: {
        blog: true,
      },
    });

    res.status(200).json({
      length: savedBlog.length,
      data: savedBlog,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavedBlog = async (req: any, res: any) => {
  const { userId, blogId } = req.body;
  try {
    // if user already saved this post
    const user = await prisma.savedBlog.findFirst({
      where: {
        userId,
        blogId,
      },
    });

    if (user) {
      return res.status(400).json({
        message: "User already saved this post",
      });
    }
    if (userId !== req.user.id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }
    // if post not created yet
    const post = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!post) {
      return res.status(400).json({
        message: "Post not found",
      });
    }

    const savedBlog = await prisma.savedBlog.create({
      data: {
        userId,
        blogId,
      },
      include: {
        blog: true,
      }
    });

    // trigger update saved count
    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        savedCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "Post Blog saved",
      data: savedBlog,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteSavedBlog = async (req: any, res: any) => {
  const { userId, blogId } = req.body;
  try {
    // if user already saved this post
    const user = await prisma.savedBlog.findFirst({
      where: {
        userId,
        blogId,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not saved this post",
      });
    }

    if (userId !== req.user.id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    const savedBlog = await prisma.savedBlog.delete({
      where: {
        id: user.id,
      },
    });

    // trigger update saved count
    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        savedCount: {
          decrement: 1,
        },
      },
    });

    res.status(201).json({
      message: "Post unsaved",
      data: savedBlog,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: error.message });
    }
  }
};
