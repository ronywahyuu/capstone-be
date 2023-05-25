import { Request, Response } from "express";
import prisma from "../database/config";

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        postDonasi: true,
        postBlog: true,
      },
    });
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { getUser };
