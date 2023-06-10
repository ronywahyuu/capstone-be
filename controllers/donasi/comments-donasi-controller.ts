import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../database/config";

export const createCommentDonasi = async (req: any, res: any) => {
  const { comment, postId } = req.body;

  console.log(req.body);
  try {
    // find first post by id
    const post = await prisma.postDonasi.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    

    const newComment = await prisma.commentsDonasi.create({
      data :{
        postId,
        comment,
        authorId : req.user.id
      }
    });

    // trigger increase comment count
    await prisma.postDonasi.update({
      where: {
        id: postId,
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

export const getCommentDonasi = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comments = await prisma.commentsDonasi.findMany({
      where: {
        postId: id,
      },
      include:{
        author: true
      }
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
