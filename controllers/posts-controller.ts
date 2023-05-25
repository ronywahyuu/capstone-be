import { Request, Response } from "express";
import prisma from "../database/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.postDonasi.findMany({});
    // const posts = await prisma.$queryRaw`
    //   SELECT * FROM PostDonasi
    // `

    if (!posts) {
      res.status(404).json({ message: "Posts not found" });
    }

    res.status(200).json({
      length: posts.length,
      posts,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.postDonasi.findFirst({
      where: {
        id: id,
      },
    });

    const comment = await prisma.commentsDonasi.findMany({
      where: {
        postId: id,
      },
      include: {
        author: true,
      },
    });

    const authorId = post?.authorId ?? null;

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      post,
      comments: comment,
    });
  } catch (error) {
    res.status(404).json({ message: "Post not found" });
  } finally {
    await prisma.$disconnect();
  }
};

const createPost = async (req: any, res: any) => {
  const { title, description, linkForm } = req.body;
  try {
    // create post based on authenticated author
    const post = await prisma.postDonasi.create({
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        description,
        linkForm,
        authorId: req.user.id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: error.message });
    }
  }
};

const updatePost = async (req: any, res: any) => {
  // only author can update post
  const { id } = req.params;
  const { title, description, linkForm } = req.body;

  try {
    const post = await prisma.postDonasi.findFirst({
      where: {
        id: id,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    if (post?.authorId !== req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const updatedPost = await prisma.postDonasi.update({
      where: {
        id: id,
      },
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        description,
        linkForm,
      },
    });

    res.status(200).json({
      message: "Post updated",
      updatedPost,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

const deletePost = async (req: any, res: any) => {
  // only author can delete post
  const { id } = req.params;

  try {
    const post = await prisma.postDonasi.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post?.authorId !== req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    await prisma.postDonasi.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
