import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../database/config";
import { Request, Response } from "express";

export const createCommentBlog = async (req: any, res: any) => {
  const { comment, blogId } = req.body;

  try {
    // find first post by id
    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    

    const newComment = await prisma.commentsBlog.create({
      data: {
        blogId,
        comment,
        authorId: req.user.id,
      },
    });

    // trigger update comment count
    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        commentsCount:{
          increment: 1
        }
      }
    });

    res.status(201).json({
      message: "Comment created",
      comment: newComment,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const getCommentBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findFirst({
      where: {
        id,
      },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    const comments = await prisma.commentsBlog.findMany({
      where: {
        blogId: id,
      },
    });

    res.status(200).json({
      length: comments.length,
      comments,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
