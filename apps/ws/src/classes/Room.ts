import { Message } from "./Message";
import { User } from "./User";
import { DrawEvent } from "@repo/commons/commons";

export class Room {
  public id: string;
  public users: User[];
  public messages: Message[];
  public shapes: DrawEvent[];
  public hasEnded: boolean = false;

  constructor(
    id: string,
    users: User[],
    messages: Message[],
    hasEnded: boolean
  ) {
    this.id = id;
    this.users = users;
    this.shapes = [];
    this.messages = messages;
    this.hasEnded = hasEnded;
  }

  drawShape(user: User, shapeData: DrawEvent) {
    if (this.hasEnded) {
      user.send("Room has ended!");
      return;
    }
    this.shapes.push(shapeData);

    this.users.forEach((u) => {
      u.sendJSON({
        type: "shape",
        payload: shapeData,
        from: user.id,
      });
    });
  }

  joinRoom(user: User) {
    if (this.hasEnded) {
      user.send("Room has ended");
    }

    this.users.push(user);

    user.sendJSON({
      type: "init",
      payload: this.shapes,
    });

    this.broadcastEvent({
      type: "user_joined",
      payload: {
        userId: user.id,
        username: user.username,
        pfp: user.pfp,
      },
    });
  }

  leaveRoom(user: User) {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.broadcastEvent({
      type: "user_left",
      payload: {
        userId: user.id,
      },
    });
  }

  private broadcastEvent(data: any) {
    this.users.forEach((u) => {
      u.sendJSON(data);
    });
  }
}

const rooms = new Map<string, Room>();

function getOrCreateRoom(roomId: string): Room {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Room(roomId, [], [], false));
  }
  return rooms.get(roomId)!;
}

export { getOrCreateRoom };
