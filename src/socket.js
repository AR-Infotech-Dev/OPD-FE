import { io } from "socket.io-client";
import { API_SERVER_URL } from "./api/config";

const socket = io(API_SERVER_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export default socket;
