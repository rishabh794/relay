import { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !file) return;
    
    onSendMessage(newMessage, file);

    setNewMessage('');
    setFile(null);
    e.target.reset();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {file && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
          <Paperclip className="w-4 h-4 text-indigo-600" />
          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
          <button
            type="button"
            onClick={removeFile}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </div>
        </label>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />

        <button 
          type="submit" 
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={newMessage.trim() === '' && !file}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;