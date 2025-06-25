import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlwares/AuthMiddleware.js";
import {
  createRoom,
  getAllRooms,
  getUserRooms,
} from "../controllers/roomController.js";

export const RoomRouter: Router = Router();

RoomRouter.post("/create", authMiddleware, (req: Request, res: Response) => {
  createRoom(req, res);
});

RoomRouter.get("/getAll", (req: Request, res: Response) => {
  getAllRooms(req, res);
});

RoomRouter.get("/getMyRooms", (req: Request, res: Response) => {
  getUserRooms(req, res);
});
