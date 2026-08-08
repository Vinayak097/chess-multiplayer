import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? "https://chess-multiplayer-lmrj.onrender.com"
    : "http://localhost:3000");

export const socket = io(socketUrl, { transports: ["websocket"] });

export default socket;
