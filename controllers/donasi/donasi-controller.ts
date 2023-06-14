import { NextFunction, Request, Response } from "express";
import prisma from "../../database/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { imgPathGenerator } from "../../utils/helpers";
import { PostDonasi } from "@prisma/client";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { initializeApp } from "@firebase/app";
// import { uploadFirebase } from "../../middleware/upload-firebase";
import config from "../../database/firebase.config";
import { uploadFirebase } from "../../middleware/upload-firebase";
import { deleteFiles } from "../../utils/delete-files";
export const getAllPosts = async (req: Request, res: Response) => {
  // query
  // const { page, limit } = req.query;
  const { userId } = req.query;
  try {
    // const posts = await prisma.postDonasi.findMany({});

    // get all post with ascending order
    // const posts: Promise<PostDonasi> = await DonasiService.getAll();
    const posts = await prisma.postDonasi.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarImg: true,
          },
        },
      },
    });

    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }

    // get mine
    if (userId) {
      const mine = posts.filter((post) => post.authorId === userId);
      return res.status(200).json({
        message: "Success fetch my posts",
        length: mine.length,
        posts: mine,
      });
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

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const post = await prisma.postDonasi.findFirst({
      where: {
        id: id,
      },
      include: {
        author: true,
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
      return res.status(404).json({
        error: true,
        message: "Post not found",
      });
      // return new ErrorHandler(404, "Post not found");
    }
    res.status(200).json({
      error: false,
      post,
      comments: comment,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  } finally {
    await prisma.$disconnect();
  }
};

export const createPost = async (req: any, res: any) => {
  const { title, description, linkForm } = req.body;

  try {
    // create post based on authenticated author
    const post = await prisma.postDonasi.create({
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        description,
        linkForm,
        bannerImg: await uploadFirebase(req.file),
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

export const updatePost = async (req: any, res: any) => {
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

    await deleteFiles(post?.bannerImg ?? "");

    // const baseUrl = req.protocol + "://" + req.get("host");

    // let imgPath: string | undefined;
    // // avatar image path
    // if (req.file) {
    //   imgPath = baseUrl + "/uploads/img/" + req.file?.filename;
    // }
    const imgUrl = await uploadFirebase(req.file);

    const updatedPost = await prisma.postDonasi.update({
      where: {
        id: id,
      },
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        description,
        linkForm,
        bannerImg: imgUrl,
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

export const deletePost = async (req: any, res: any) => {
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

    await deleteFiles(post?.bannerImg ?? "")

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
