import { Request, Response, Router } from "express";
import { authMiddleware, AuthRequest } from "../middlwares/AuthMiddleware.js";
import {
  createRoom,
  getAllRooms,
  getUserRooms,
} from "../controllers/roomController.js";

export const RoomRouter: Router = Router();

RoomRouter.post("/create", authMiddleware, (req: Request, res: Response) => {
  createRoom(req as AuthRequest, res);
});

RoomRouter.get("/getAll", (req: Request, res: Response) => {
  getAllRooms(req, res);
});

RoomRouter.get("/getMyRooms", authMiddleware, (req: Request, res: Response) => {
  getUserRooms(req as AuthRequest, res);
});
