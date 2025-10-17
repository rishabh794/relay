import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import io from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useToast } from '../hooks/useToast';
import ToastContainer from './ToastContainer';

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    socket.current = io('http://localhost:5000', { withCredentials: true });

    socket.current.on('receiveMessage', (message) => {
      if (message.sender._id === selectedUser?._id || message.sender._id === user.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.current.on('messageDeleted', ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
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
        addToast('File upload failed', 'error');
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

  const handleDeleteMessage = (messageId) => {
    socket.current.emit('deleteMessage', { messageId });
    addToast('Message deleted', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold text-white">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
            <p className="text-sm text-gray-600">{selectedUser.email}</p>
          </div>
        </div>
      </div>

      <MessageList
        messages={messages}
        currentUser={user}
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageInput onSendMessage={handleSendMessage} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ChatBox;