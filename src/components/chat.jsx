import React, { useState, useEffect } from 'react'

const Chat = ({ socket, userName, chatRoom }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleSendMessage = () => {
    if (chatMessage.trim() !== '') {
      const now = new Date();
      const chatMessageData = {
        id: Math.random(),
        message: chatMessage,
        sender: userName,
        chatRoom: chatRoom,
        date: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
      };

      socket.emit('send_message', chatMessageData);
      setMessageList(prevList => [...prevList, chatMessageData]);
      setChatMessage('');
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList(prevList => [...prevList, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className="chat-container">
      <h1>Welcome, {userName}</h1>

      <div className="chat-messages">
        {messageList.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.sender === userName ? 'sender' : 'receiver'}`}
          >

            <p>{msg.message}</p>
            <div className="message-header">
              <strong>{msg.sender}</strong>
              <span className="date">{msg.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          autoFocus
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
