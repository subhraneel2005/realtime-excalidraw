import { Request, Response } from "express";
import { prisma } from "@repo/db/prisma";
import { AuthRequest } from "../middlwares/AuthMiddleware.js";

async function createRoom(req: AuthRequest, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const newRoom = await prisma.room.create({
      data: {
        adminId: user?.id,
      },
    });

    return res.status(201).json({
      message: "Room created",
      data: newRoom,
    });
  } catch (error) {
    console.log("Error in room controller" + error);
    return res.status(500).json({
      message: "Internal server error at room controller",
      error: error,
    });
  }
}

async function getAllRooms(req: Request, res: Response) {
  try {
    const allRooms = await prisma.room.findMany({
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });

    if (!allRooms) {
      return res.status(404).json({
        message: "No rooms found",
      });
    }
    return res.status(200).json({
      message: "All Rooms",
      data: allRooms,
    });
  } catch (error) {
    console.log("Internal server error ar Get all room controller" + error);
    return res.json({
      message: "Internal server error ar Get all room controller",
      error: error,
    });
  }
}

async function getUserRooms(req: AuthRequest, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const userRooms = await prisma.room.findMany({
      where: {
        adminId: user?.id,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (!userRooms || userRooms.length === 0) {
      return res.status(404).json("No rooms found for User: " + user?.id);
    }

    return res.status(200).json({
      message: "My rooms",
      data: userRooms,
    });
  } catch (error) {
    console.log("Internal server error ar Get user's room controller" + error);
    return res.json({
      message: "Internal server error ar Get user's room controller",
      error: error,
    });
  }
}

export { createRoom, getAllRooms, getUserRooms };
