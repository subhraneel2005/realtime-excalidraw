enum Shape {
  "rect",
  "circle",
  "line",
  "text",
}

type DrawEvent = {
  type: Shape;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color?: string;
};

const SUBSCRIBE = "subscribe";
const UNSUBSCRIBE = "unsubscribe";
const JOIN_ROOM = "join_room";
const LEAVE_ROOM = "leave_room";
const SEND_MESSAGE = "chat";
const DRAW_SHAPE = "draw_shape";

export {
  SUBSCRIBE,
  UNSUBSCRIBE,
  JOIN_ROOM,
  LEAVE_ROOM,
  SEND_MESSAGE,
  DRAW_SHAPE,
};

export type { DrawEvent };
