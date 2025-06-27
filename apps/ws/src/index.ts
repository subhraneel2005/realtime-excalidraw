import "dotenv/config.js";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { SUBSCRIBE } from "@repo/commons/commons";
const PORT = parseInt(process.env.PORT!) || 3001;

const wss = new WebSocketServer({ port: PORT });
console.log(`🔗 Connect using: ws://localhost:${PORT}`);

wss.on("connection", (ws, req) => {
  console.log("🔔 Incoming connection request");
  const { query } = url.parse(req.url!, true);
  const token = query.token as string;
  const roomId = query.roomId as string;

  ws.on("message", (message) => {
    if (message.toString() !== SUBSCRIBE) {
      ws.close();
      return;
    }

    ws.send("Connected to websocket");
  });
});
