import React, { useState } from 'react'
import io from 'socket.io-client'
import Chat from './components/chat'

const socket = io.connect("https://chat-application-backend-node-js.vercel.app");


const App = () => {

  const [userName, setUserName] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  console.log(userName, chatRoom)

  const handleJoinChat = () => {
    if (userName !== '' && chatRoom !== '') {
      socket.emit('join_room', chatRoom)
      setShowChat(true)

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
        <Chat socket={socket} userName={userName} chatRoom={chatRoom} />
      )}
    </div>

  )
}

export default App