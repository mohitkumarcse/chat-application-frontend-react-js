import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ socket, userName, chatRoom }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join_room', chatRoom);
  }, [chatRoom, socket]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prevList) => [...prevList, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;

    const now = new Date();
    const chatMessageData = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: chatMessage,
      sender: userName,
      chatRoom,
      date: `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
    };

    socket.emit('send_message', chatMessageData);
    setChatMessage('');
  };

  return (
    <div className="chat-container">
      <h1>Welcome, {userName}</h1>

      <div
        className="chat-messages"
        style={{ height: '300px', overflowY: 'auto' }}
      >
        {messageList.map((msg) => (
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
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          autoFocus
        />
        <button onClick={handleSendMessage} disabled={chatMessage.trim() === ''}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
