import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import io from 'socket.io-client';
import axios from 'axios';

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.current = io('http://localhost:5000', {
      withCredentials: true, 
    });

    socket.current.on('receiveMessage', (message) => {
      if (message.sender._id === selectedUser?._id || message.sender._id === user.id) {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !file) return;

    let fileUrl = null;
    let fileType = null;
    let fileName = null;
    let fileSize = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/upload',
          formData,
          { withCredentials: true }
        );
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
      content: newMessage,
      fileUrl,
      fileType,
      fileName,
      fileSize,
    });

    setNewMessage('');
    setFile(null);
    e.target.reset(); 
  };

  const renderMessageContent = (msg) => {
    if (msg.fileUrl) {
      if (msg.fileType?.startsWith('image')) {
        return <img src={msg.fileUrl} alt={msg.fileName || "sent image"} style={{ maxWidth: '200px', borderRadius: '8px' }} />;
      }
      if (msg.fileType?.startsWith('video')) {
        return <video src={msg.fileUrl} controls style={{ maxWidth: '250px', borderRadius: '8px' }} />;
      }
      return (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#000' }}>
          {msg.fileName || "View Document"}
        </a>
      );
    }
    return msg.content;
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
            <div style={{
              background: msg.sender._id === user.id ? '#dcf8c6' : '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'inline-block',
              maxWidth: '70%',
              wordWrap: 'break-word',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
            }}>
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ flexShrink: 0 }}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 15px', border: 'none', background: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;