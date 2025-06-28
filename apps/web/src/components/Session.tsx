"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseHttpUrl, baseWsUrl, clientUrl } from "@/lib/env";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { useSession } from "../lib/auth-client";
import { SUBSCRIBE } from "@repo/commons/commons";
import { cleanToken } from "@/lib/utils";

export default function Session() {
  const { data: session } = useSession();

  const [token, setToken] = useState("");
  const [roomId, setroomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setcopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch("/api/token", { credentials: "include" });
      const data = await res.json();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  async function startSessionHandler() {
    try {
      setLoading(true);
      if (!session) {
        toast.warning("Login to start", {
          action: {
            label: "Login",
            onClick: () => {
              router.push("/signin");
            },
          },
        });
        return;
      }
      const res = await axios.post(
        `${baseHttpUrl}/api/room/create`,
        {},
        {
          withCredentials: true,
        }
      );
      const id = res.data.data.id;
      setroomId(id);
    } catch (error) {
      toast.error("Error creatimg room");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function redirectHandler() {
    try {
      if (!token) {
        toast.warning("You're not logged in");
        return;
      }

      const cleanedToken = encodeURIComponent(token);

      const socket = new WebSocket(
        `${baseWsUrl}?token=${cleanedToken}&roomId=${roomId}`
      );

      socket.onopen = () => {
        console.log("✅ Connected to room:", roomId);

        setTimeout(() => {
          socket.send(
            JSON.stringify({
              type: "subscribe",
            })
          );
        }, 5000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Received:", data);

          // Handle different message types
          switch (data.type) {
            case "init":
              console.log("🎨 Received initial shapes:", data.payload);
              // Handle initial shapes - you can draw them on canvas here
              break;
            case "shape":
              console.log("✏️ New shape drawn:", data.payload);
              // Handle new shapes being drawn by other users
              break;
            case "user_joined":
              console.log("👋 User joined:", data.payload);
              break;
            case "user_left":
              console.log("👋 User left:", data.payload);
              break;
            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("❌ Error parsing message:", error);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        toast.error("WebSocket connection failed");
      };
    } catch (error) {}
  }

  function copyUrl(url: string) {
    try {
      setcopied(true);
      navigator.clipboard.writeText(url);
      toast.info("Url copied", {
        description: "Share this url with your friends to start collaborating",
      });
    } catch (error) {
      toast.error("failed to copy");
    } finally {
      setTimeout(() => {
        setcopied(false);
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-full justify-center items-center space-y-6">
      <h2 className="text-4xl font-bold ">Start Collab</h2>
      <Card className="w-full p-4 max-w-xl shadow-lg border border-gray-200">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xl font-semibold">
              Start or Join a Session
            </span>
            <span className="text-gray-500 text-sm">
              Collaborate in real-time with your team
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {roomId ? (
            <div className="flex flex-col justify-center items-center w-full space-y-4">
              <span className="w-full">
                <span className=" bg-muted p-2 rounded-md flex justify-center items-center gap-2">
                  <p className="truncate">{`${clientUrl}/canvas/${roomId}`} </p>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => copyUrl(`${clientUrl}/canvas/${roomId}`)}
                  >
                    {" "}
                    {copied ? <Check /> : <Copy />}
                  </Button>
                </span>
              </span>
              <Button className="w-full" onClick={redirectHandler}>
                Enter Session
              </Button>
            </div>
          ) : (
            <Button
              onClick={startSessionHandler}
              disabled={loading}
              className="w-full"
              variant="default"
              size="lg"
            >
              {loading ? "Starting..." : "Start New Session"}
            </Button>
          )}

          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400 text-xs">or</span>
          </div>
          <input
            type="text"
            placeholder="Enter Session Code"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <Button className="w-full" variant="secondary" size="lg">
            Join Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
