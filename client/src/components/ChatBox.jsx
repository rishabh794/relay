import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import io from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5000', { withCredentials: true });

    socket.current.on('receiveMessage', (message) => {
      if (message.sender._id === selectedUser?._id || message.sender._id === user.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.current.disconnect();
  }, [selectedUser, user.id]);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`, { withCredentials: true })
        .then(res => setMessages(res.data))
        .catch(err => console.error("Failed to fetch messages", err));
    }
  }, [selectedUser]);

  const handleSendMessage = async (content, file) => {
    let fileUrl = null;
    let fileType, fileName, fileSize;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await axios.post('http://localhost:5000/api/upload', formData, { withCredentials: true });
        fileUrl = data.url;
        fileType = data.fileType;
        fileName = data.fileName;
        fileSize = data.fileSize;
      } catch (error) {
        console.error('File upload failed', error);
        alert('File upload failed!');
        return;
      }
    }

    socket.current.emit('sendMessage', {
      receiverId: selectedUser._id,
      content,
      fileUrl,
      fileType,
      fileName,
      fileSize,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MessageList messages={messages} currentUser={user} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBox;