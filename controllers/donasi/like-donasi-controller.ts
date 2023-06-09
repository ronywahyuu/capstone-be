import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../database/config";

export const createLikeDonasi = async (req: any, res: any) => {
  const { postId, userId } = req.body;
  try {
    // find post first
    const donasi = await prisma.postDonasi.findUnique({
      where: {
        id: postId,
      },
    });

    if (!donasi) {
      return res.status(400).json({
        error: true,
        message: "Post not found",
      });
    }

    if (req.user.id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You are not allowed to delete this like",
      });
    }

    const user = await prisma.likePostDonasi.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (user) {
      return res.status(400).json({
        error: true,
        message: "You already like this post",
      });
    }

    // create like
    const like = await prisma.likePostDonasi.create({
      data: {
        postId,
        userId,
      },
    });

    // update like count
    await prisma.postDonasi.update({
      where: {
        id: postId,
      },
      data: {
        likedCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "Post Liked",
      like,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

// get like donasi by current user
export const getLikeDonasiByUser = async (req: any, res: any) => {
  const { userId } = req.query;
  // console.log(req.query);
  try {
    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (req.user.id !== userId) {
      res.status(401).json({ message: "You are not allowed to get this like" });
      return;
    }
    // const postDonasi = await prisma.likePostDonasi.findUnique({
    //   where: {
    //     id:userId,
    //   },
    // });

    // if (!postDonasi) {
    //   res.status(404).json({ message: "Post not found" });
    //   return;
    // }

    const like = await prisma.likePostDonasi.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      message: "Get like by current user",
      like,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const getLikeDonasi = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const postDonasi = await prisma.postDonasi.findUnique({
      where: {
        id,
      },
    });

    if (!postDonasi) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    // if (!id) {
    //   res.status(404).json({ message: "Post not found" });
    //   return;
    // }

    const likes = await prisma.likePostDonasi.findMany({
      where: {
        postId: id,
      },
    });

    res.status(200).json({
      message: "Get likes",
      likes,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};

export const deleteLikeDonasi = async (req: any, res: any) => {
  const { postId, userId } = req.body;

  try {
    // find post first
    const post = await prisma.postDonasi.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(400).json({
        error: true,
        message: "Post not found",
      });
    }

    const userLiked = await prisma.likePostDonasi.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!userLiked) {
      return res.status(400).json({
        error: true,
        message: "You already disliked this post",
      });
    }

    if (req.user.id !== userId) {
      return res.status(400).json({
        error: true,
        message: "You are not allowed to delete this like",
      });
    }

    // check if user already like this post

    // delete like
    const like = await prisma.likePostDonasi.delete({
      where: {
        id: userLiked.id,
      },
    });

    if (post.likedCount === 0) {
      return res.status(400).json({
        error: true,
        message: "Already 0 like",
      });
    }

    // update like count
    await prisma.postDonasi.update({
      where: {
        id: postId,
      },
      data: {
        likedCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      message: "Post Disliked",
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(500).json({ message: err.message });
    }
  }
};
