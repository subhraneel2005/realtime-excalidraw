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

export { createRoom };
