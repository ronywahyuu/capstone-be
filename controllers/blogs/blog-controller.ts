import { Request, Response } from "express";
import prisma from "../../database/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { uploadFirebase } from "../../middleware/upload-firebase";
import { deleteFiles } from "../../utils/delete-files";

// interface UserPayload {
//   id: string;
//   email: string;
// }

export const getAllBlog = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const blogs = await prisma.blog.findMany({
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

    // get mine
    if (userId) {
      const mine = blogs.filter((blog) => blog.authorId === userId);
      return res.status(200).json({
        message: "Success fetch my blogs",
        length: mine.length,
        blogs: mine,
      });
    }

    res.status(200).json({
      length: blogs.length,
      blogs,
    });
  } catch (error) {}
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
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
        comments: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      blog,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const createBlog = async (req: any, res: any) => {
  const { title, body } = req.body;
  // const user = req.user as UserPayload;
  // const baseUrl = `${req.protocol}://${req.get("host")}`;

  // let bannerImg: string | undefined = undefined;
  // if (req.file) {
  //   bannerImg = `${baseUrl}/${req.file.path}`;
  // }

  // const storeImg = bannerImg || null;

  const bannerImg = await uploadFirebase(req.file);

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        body,
        bannerImg: bannerImg,
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const updateBlog = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const findBlog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
    });

    
    if (!findBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await deleteFiles(findBlog?.bannerImg ?? "");

    if (findBlog?.authorId !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const baseUrl = req.protocol + "://" + req.get("host");

    let imgPath: string | undefined;
    // avatar image path
    if (req.file) {
      imgPath = baseUrl + "/uploads/img/" + req.file?.filename;
    }

    // check user

    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        title,
        slug: title.toLowerCase().split(" ").join("-"),
        body,
        bannerImg: imgPath,
      },
    });

    res.status(200).json({
      message: "Blog updated",
      blog,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const deleteBlog = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const findBlog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
    });

    if (!findBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user.id !== findBlog?.authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await deleteFiles(findBlog?.bannerImg ?? "" )

    const blog = await prisma.blog.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Blog deleted",
      blog,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
