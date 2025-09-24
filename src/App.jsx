import React, { useState } from 'react'
import io from 'socket.io-client'
import Chat from './components/chat'

const socket = io.connect("https://chat-application-backend-node-js.vercel.app");

const App = () => {
  const [userName, setUserName] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleJoinChat = () => {
    const trimmedUser = userName.trim();
    const trimmedRoom = chatRoom.trim();
    if (trimmedUser !== '' && trimmedRoom !== '') {
      // Optionally, remove this if handled inside Chat component
      socket.emit('join_room', trimmedRoom);
      setShowChat(true);
    }
  }

  return (
    <div className='join_room'>
      {!showChat ? (
        <>
          <h1>Join Room</h1>
          <input
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            type="text"
            placeholder="Enter Chat Room"
            onChange={(e) => setChatRoom(e.target.value)}
            value={chatRoom}
          />
          <button type="submit" onClick={handleJoinChat}>Join</button>
        </>
      ) : (
        <Chat socket={socket} userName={userName.trim()} chatRoom={chatRoom.trim()} />
      )}
    </div>
  )
}

export default App;
