import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users", {
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
    <div style={{ display: "flex", height: "90vh" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h2>Users</h2>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{ padding: "10px", cursor: "pointer", background: selectedUser?._id === user._id ? "#e0e0e0" : "transparent" }}
          >
            {user.name}
          </div>
        ))}
      </div>

      <div style={{ width: "70%" }}>
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} /> 
        ) : (
          <div style={{ padding: '20px' }}>
            <h2>Select a user to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;