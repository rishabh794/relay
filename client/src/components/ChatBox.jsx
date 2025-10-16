import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import io from 'socket.io-client';
import axios from 'axios';

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5000', {
      withCredentials: true, 
    });

    socket.current.on('receiveMessage', (message) => {
  if (
    message.sender._id === selectedUser?._id ||
    message.sender._id === user.id 
  ) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
});

socket.current.on('sendMessageError', (error) => {
      console.error("Message failed to send:", error);
      alert(`Error: ${error.message}`); 
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedUser, user.id]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
         const { data } = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    socket.current.emit('sendMessage', {
      receiverId: selectedUser._id,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1, border: '1px solid #eee', padding: '10px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
                textAlign: msg.sender._id === user.id ? 'right' : 'left',
                margin: '5px 0',
            }}
            >
            <p style={{
                background: msg.sender._id === user.id ? '#dcf8c6' : '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'inline-block',
                maxWidth: '70%',
                wordWrap: 'break-word',
            }}>
                {msg.content}
            </p>
            </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;