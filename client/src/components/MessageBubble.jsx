import moment from 'moment';
import { X, File, Image as ImageIcon, Video } from 'lucide-react';

const MessageBubble = ({ message, currentUser, onDelete }) => {
  const isSender = message.sender._id === currentUser.id;

  const renderMessageContent = (msg) => {
    return (
      <>
        {msg.content && <p className="m-0 text-sm leading-relaxed">{msg.content}</p>}

        {msg.fileUrl && (
          <div className={msg.content ? 'mt-2' : ''}>
            {msg.fileType?.startsWith('image') ? (
              <div className="relative group">
                <img 
                  src={msg.fileUrl} 
                  alt={msg.fileName || "sent image"} 
                  className="max-w-xs rounded-lg shadow-sm"
                />
              </div>
            ) : msg.fileType?.startsWith('video') ? (
              <video 
                src={msg.fileUrl} 
                controls 
                className="max-w-sm rounded-lg shadow-sm"
              />
            ) : (
              <a 
                href={msg.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <File className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-900 underline">
                  {msg.fileName || "View Document"}
                </span>
              </a>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-md lg:max-w-lg xl:max-w-xl group ${
        isSender ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'
      } rounded-2xl px-4 py-2.5 shadow-sm`}>
        {renderMessageContent(message)}
        <div className={`text-xs mt-1 ${
          isSender ? 'text-indigo-100' : 'text-gray-500'
        }`}>
          {moment(message.createdAt).format('h:mm A')}
        </div>
        
        {isSender && (
          <button
            onClick={() => onDelete(message._id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;