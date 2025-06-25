import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { Session, User } from "better-auth";

export interface AuthRequest extends Request {
  user: User;
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    (req as AuthRequest).user = session.user;
    next();
  } catch (error) {
    console.log("Middleware error: ", error);
    res
      .status(500)
      .json({ message: "Internal server error at middleware" + error });
    return;
  }
}

export { authMiddleware };
