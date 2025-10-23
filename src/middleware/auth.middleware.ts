import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      anon_name?: any;
    }
  }
}

interface JwtPayload {
  id: string;
  anon_name: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.anon_name = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
