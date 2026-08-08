const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? "https://chess-multiplayer-lmrj.onrender.com"
    : "http://localhost:3000");

export default socketUrl;
