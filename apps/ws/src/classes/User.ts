import { WebSocket } from "ws";

export class User {
  public id: string;
  public username: string;
  public pfp: string;
  public socket: WebSocket;

  constructor(id: string, username: string, pfp: string, socket: WebSocket) {
    this.id = id;
    this.username = username;
    this.pfp = pfp;
    this.socket = socket;
  }

  send(message: string): void {
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(message);
    }
  }

  sendJSON(data: any): void {
    this.send(JSON.stringify(data));
  }
}
