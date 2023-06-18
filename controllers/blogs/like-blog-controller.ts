import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../database/config";

export const createLikeBlog = async (req: any, res: any) => {
  const { userId, blogId } = req.body;
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    if (req.user.id !== userId) {
      return res
        .status(400)
        .json({ message: "You are not allowed to perform like action " });
    }

    const user = await prisma.likeBlog.findFirst({
      where: {
        userId,
        blogId,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "You already like this blog post" });
    }

    const like = await prisma.likeBlog.create({
      data: {
        blogId,
        userId
      },
    });

    // update like count
    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likedCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "Blog Liked",
      like,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
export const getLikeBlog = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    // const like = await prisma.likeBlog.findFirst({
    //   where: {
    //     blogId: id,
    //   },
    // });
    const likes = await prisma.likeBlog.findMany({
      where: {
        blogId: id,
      },
    });

    res.status(200).json({
      message: "Get Like Blog",
      likes,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
};

export const deleteLikeBlog = async (req: any, res: any) => {
  const { blogId, userId } = req.body;

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    if (req.user.id !== userId) {
      return res
        .status(400)
        .json({ message: "You are not allowed to perform like action " });
    }

    const like = await prisma.likeBlog.findFirst({
      where: {
        blogId,
        userId,
      },
    });

    if (!like) {
      return res.status(400).json({
        error: true,
        message: "You are not allowed to delete this like",
      });
    }

    // delete like
    await prisma.likeBlog.delete({
      where: {
        id: like.id,
      },
    });

    // update like count
    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likedCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      message: "Post Unliked",
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
