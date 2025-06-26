"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useSession } from "../lib/auth-client";
import { toast } from "sonner";
import axios from "axios";

const baseHttpUrl = process.env.NEXT_PUBLIC_SERVER_URL!;
const baseWsUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL!;

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const { data: session } = useSession();
  const token = session?.session?.token;

  function createRoomHandler() {
    if (!token) {
      toast.warning("You're not logged in");
      return;
    }

    axios
      .post(
        `${baseHttpUrl}/api/room/create`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const id = res.data.data.id;
        setRoomId(id);

        toast.success("Room created with id", {
          description: "Room Id: " + id,
        });

        console.log("room id after toast: " + id);

        const socket = new WebSocket(
          `ws://localhost:8080?token=${token}&roomId=${id}`
        );

        socket.onopen = () => {
          toast.success("Connected to websocket server");
          socket.send(
            JSON.stringify({
              type: "join_room",
              roomId: id,
            })
          );
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          toast.error("WebSocket connection failed");
        };
      })
      .catch((err) => {
        toast.error("Failed to create room");
        console.error("Create room error:", err);
      });
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Button onClick={createRoomHandler}>Create Room</Button>
    </div>
  );
}
