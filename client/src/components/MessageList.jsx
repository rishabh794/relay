import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUser, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          currentUser={currentUser}
          onDelete={onDeleteMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;