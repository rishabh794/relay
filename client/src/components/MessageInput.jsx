import { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [newMessage, setNewMessage]  = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !file) return;
    
    onSendMessage(newMessage, file);

    setNewMessage('');
    setFile(null);
    e.target.reset(); 
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
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
  );
};

export default MessageInput;