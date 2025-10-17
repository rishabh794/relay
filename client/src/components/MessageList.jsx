import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto' }}>
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;