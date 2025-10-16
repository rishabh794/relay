import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

const ProfilePage = () => {
  const { user, updateUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        'http://localhost:5000/api/users/update',
        formData,
        { withCredentials: true }
      );
      alert(data.message);
      updateUser(); 
    } catch (error) {
      console.error("Update failed:", error.response?.data);
      alert('Failed to update profile: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This will delete all your messages and cannot be undone.")) {
      try {
        await axios.delete('http://localhost:5000/api/users/delete', { withCredentials: true });
        alert('Account deleted successfully.');
        await signOut(); 
        navigate('/login'); 
      } catch (error) {
        console.error("Deletion failed:", error.response?.data);
      }
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label><br/>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br/>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label><br/>
          <input
            name="phoneNumber"
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h2>Delete Account</h2>
      <p style={{ color: '#555' }}>
        This will permanently delete your account, including all your conversations. This action cannot be undone.
      </p>
      <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
        Delete My Account
      </button>
    </div>
  );
};

export default ProfilePage;