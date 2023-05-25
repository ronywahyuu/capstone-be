import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const createJWT = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string
  );
  return token;
};

// const protect = (req: any, res: Response, next: NextFunction) => {
//   const bearer = req.headers.authorization;

//   if (!bearer) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = bearer.split(" ")[1].trim();

//   if (!token) {
//     return res.status(401).json({ message: "not valid token" });
//   }

//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = user;
//     next();
//   } catch (e) {
//     console.error(e);
//     res.status(401);
//     res.json({ message: "not valid token" });
//     return;
//   }
// };

const protect = async (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })
}

// signout user
const signout = async (req: Request, res: Response) => {
  try {
    // delete token from authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // if jwt token is valid, signout user
    if (token) {
      res.status(200).json({ message: "User signed out" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { comparePasswords, hashPassword, createJWT, protect };
