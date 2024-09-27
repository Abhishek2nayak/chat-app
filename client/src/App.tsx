import { createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/JoinRoomScreen";
import ChatRoom from "./pages/ChatRoomScreen";
import useSocket from "./hooks/useSocket";
import { Socket } from "socket.io-client";
import Login from "./pages/LoginScreen";
import Register from "./pages/RegisterScreen";
import ChatRoomLayout from "./layout/ChatRoomLayout";
import NoUserScreen from "./components/Screen/NoUser";
import HomeScreen from "./pages/HomeScreen";
import AddNewRoomScreen from "./pages/AddNewRoomScreen";
import JoinRoomScreen from "./components/Screen/JoinRoomScreen";

export type TSocketContext = Socket | null;

export const SocketContext = createContext<TSocketContext>(null);

const URL = import.meta.env.VITE_API_URL;

function App() {
  
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
          <Route index path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="room" element={<ChatRoomLayout />}>
            <Route index element={<NoUserScreen />} />
            <Route path=":id" element={<ChatRoom />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="join-room" element={<JoinRoomScreen />} />
            <Route path="add-new-room" element={<AddNewRoomScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
