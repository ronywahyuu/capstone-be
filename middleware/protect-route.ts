import jwt from "jsonwebtoken"

const protectRoute = (req: any, res: any, next: any) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    const { id, email, name, avatarImg } = user;
    next();
  });
}

export default protectRoute;