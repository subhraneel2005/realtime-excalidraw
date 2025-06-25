import { Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { generateUUID } from "../utils/generateUUID.js";
import { prisma } from "@repo/db/prisma";

async function createRoom(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user } = session;

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

async function getUserRooms(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user } = session;

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
