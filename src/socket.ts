import { io } from "socket.io-client";

const url =
  import.meta.env.VITE_PROD_SERVER_URL || import.meta.env.VITE_DEV_SERVER_URL;

const socket = io(url, { autoConnect: true });

// socket.on("connect", () => {
//   console.log(`Connected to the server with the id: ${socket.id}`);
// });

// socket.on("disconnect", () => {
//   console.log(`Disconnected from the server`);
// });

export { socket };
