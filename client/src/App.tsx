import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/JoinRoomScreen";
import ChatRoom from "./pages/ChatRoomScreen";
import useSocket from "./hooks/useSocket";
import { Socket } from "socket.io-client";
import Login from "./pages/LoginScreen";
import Register from "./pages/RegisterScreen";

export type TSocketContext = Socket | null;

export const SocketContext = createContext<TSocketContext>(null);

const URL = import.meta.env.VITE_API_URL;

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const { socket, error, isConnected } = useSocket(URL);

  // Optional: Handle socket error
  if (error) {
    console.error("Socket connection error:", error);
  }

  // Optional: Handle socket connection status
  if (isConnected) {
    console.log("Socket connected:", isConnected);
  }

  // Socket event logging (optional)
  socket?.onAny((eventName, ...args) => {
    console.log(`Received event '${eventName}' with data:`, ...args);
  });

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room/:id" element={<ChatRoom username={username} />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
