import "dotenv/config.js";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";

const PORT = parseInt(process.env.PORT!) || 3001;

const wss = new WebSocketServer({ port: PORT });
console.log(`🔗 Connect using: ws://localhost:${PORT}`);

wss.on("connection", (ws, req) => {
  console.log("🔔 Incoming connection request");
  const { query } = url.parse(req.url!, true);
  const token = query.token as string;
  const roomId = query.roomId as string;

  if (!token || !roomId) {
    console.log("❌ Missing token or roomId");
    ws.close(1008, "missing roomId or missing token");
    return;
  }

  console.log(`✅ WebSocket connected, token:${token} roomId: ${roomId}`);
});
