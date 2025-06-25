import { Request, Response } from "express";
import { prisma } from "@repo/db/prisma";
import { AuthRequest } from "../middlwares/AuthMiddleware.js";

async function createChat(req: AuthRequest, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        essage: "Unauthorized access",
      });
    }

    const { message, roomId } = req.body;
    if (!req.body) {
      return res.status(400).json({
        message: "Body can't be empty lil bro",
      });
    }

    if (!message || !roomId) {
      return res.status(400).json({
        message: "Message and roomId are required",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const newChat = await prisma.chat.create({
      data: {
        message,
        userId: user?.id,
        roomId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Chat created successfully",
      chat: newChat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export { createChat };
