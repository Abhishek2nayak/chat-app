import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import io, { Socket } from "socket.io-client"
import Home from "./pages/Home"
import ChatRoom from "./pages/ChatRoom"

const socket: Socket = io('https://chat-app-8jyb.onrender.com/');

socket.onAny((eventName, ...args) => {
  console.log(`Received event '${eventName}' with data:`, ...args);
  // You can process or log the event data here
});

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            } />
          <Route
            path="/room/:id"
            element={
              <ChatRoom
                username={username}
                socket={socket}
              />
            } />
        </Routes>
      </BrowserRouter>

    </>
  )
}


export default App
