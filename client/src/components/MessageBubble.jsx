import moment from 'moment';

const MessageBubble = ({ message, currentUser, onDelete }) => {
  const isSender = message.sender._id === currentUser.id;

  const renderMessageContent = (msg) => {
    return (
      <>
        {msg.content && <p style={{ margin: 0, padding: 0 }}>{msg.content}</p>}

        {msg.fileUrl && (
          <div style={{ marginTop: msg.content ? '8px' : '0' }}>
            {msg.fileType?.startsWith('image') ? (
              <img src={msg.fileUrl} alt={msg.fileName || "sent image"} style={{ maxWidth: '200px', borderRadius: '8px' }} />
            ) : msg.fileType?.startsWith('video') ? (
              <video src={msg.fileUrl} controls style={{ maxWidth: '250px', borderRadius: '8px' }} />
            ) : (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#000' }}>
                {msg.fileName || "View Document"}
              </a>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ textAlign: isSender ? 'right' : 'left', margin: '5px 0' }}>
      <div style={{
        background: isSender ? '#dcf8c6' : '#fff',
        padding: '8px 12px',
        borderRadius: '8px',
        display: 'inline-block',
        maxWidth: '70%',
        wordWrap: 'break-word',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>
        {renderMessageContent(message)}
        <div style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: '4px' }}>
          {moment(message.createdAt).format('h:mm A')}
        </div>
        
        {isSender && (
          <button
            onClick={() => onDelete(message._id)}
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: '0.8rem',
            }}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;