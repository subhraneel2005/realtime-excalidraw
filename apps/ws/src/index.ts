import "dotenv/config.js";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import {
  DRAW_SHAPE,
  JOIN_ROOM,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "@repo/commons/commons";
import { getOrCreateRoom, Room } from "./classes/Room";
import { User } from "./classes/User";
import { auth } from "./lib/auth";
import { validateSessionToken } from "./lib/validateToken";
const PORT = parseInt(process.env.PORT!) || 3001;

const wss = new WebSocketServer({ port: PORT });
console.log(`🔗 Connect using: ws://localhost:${PORT}`);

wss.on("connection", async (ws, req) => {
  console.log("🔔 Incoming connection request");
  const { query } = url.parse(req.url!, true);
  const token = query.token as string;
  const roomId = query.roomId as string;

  if (!token) {
    ws.close(1008, "No token provoded");
    return;
  }

  const sessionData = await validateSessionToken(token);
  if (!sessionData) {
    console.log("❌ Connection rejected: Invalid token");
    ws.close(1008, "Invalid or expired session token");
    return;
  }

  console.log("✅ Token validated successfully");

  const { user } = sessionData;

  const wsUser = new User(
    user.id,
    user.name.toLowerCase(),
    user.image || "",
    ws
  );

  const room = getOrCreateRoom(roomId);

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      switch (parsed.type) {
        case SUBSCRIBE:
          room.joinRoom(wsUser);
          break;

        case UNSUBSCRIBE:
          room.leaveRoom(wsUser);
          break;
        case DRAW_SHAPE:
          room.drawShape(wsUser, parsed.payload);
          break;
      }
    } catch (error) {
      console.error("❌ Invalid message:", error);
    }
  });

  ws.on("close", () => {
    room.leaveRoom(wsUser);
  });
});
