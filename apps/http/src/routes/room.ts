import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlwares/AuthMiddleware.js";

export const RoomRouter: Router = Router();

RoomRouter.post("/create", authMiddleware, createDemoRoom);

function createDemoRoom(req: Request, res: Response) {
  res.send("Room created");
  return;
}
