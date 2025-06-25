import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlwares/AuthMiddleware.js";
import { createRoom } from "../controllers/roomController.js";

export const RoomRouter: Router = Router();

RoomRouter.post("/create", authMiddleware, (req: Request, res: Response) => {
  createRoom(req, res);
});
