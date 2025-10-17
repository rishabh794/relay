import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { Users, MessageSquare } from "lucide-react";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          withCredentials: true,
        });
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Messages</h2>
              <p className="text-xs text-indigo-100">{users.length} contacts</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
                selectedUser?._id === user._id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${
                  selectedUser?._id === user._id ? "bg-indigo-600" : "bg-gray-400"
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    selectedUser?._id === user._id ? "text-indigo-600" : "text-gray-900"
                  }`}>
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
              <p className="text-gray-600">Choose a contact from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;