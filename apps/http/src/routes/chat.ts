import { Request, Response, Router } from "express";
import { authMiddleware, AuthRequest } from "../middlwares/AuthMiddleware.js";
import { createChat } from "../controllers/chatController.js";

export const ChatRouter: Router = Router();

ChatRouter.post("/create", authMiddleware, (req: Request, res: Response) => {
  createChat(req as AuthRequest, res);
});
