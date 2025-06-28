export class Message {
  public id: string;
  public userId: string;
  public roomId: string;
  public text: string;

  constructor(id: string, userId: string, roomId: string, text: string) {
    this.id = id;
    this.userId = userId;
    this.roomId = roomId;
    this.text = text;
  }
}
