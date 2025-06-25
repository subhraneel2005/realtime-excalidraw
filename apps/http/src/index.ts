import "dotenv/config.js";

import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { RoomRouter } from "./routes/room.js";
import { ChatRouter } from "./routes/chat.js";
const app = express();
const port = 8000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/room", RoomRouter);
app.use("/api/chat", ChatRouter);

app.listen(port, () => {
  console.log(`Http server listening on port ${port}`);
  console.log(`Client url loaded from env: ${process.env.CLIENT_URL}`);
});
