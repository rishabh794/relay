import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const ProfilePage = () => {
  const { user, updateUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  
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
      addToast(data.message || 'Profile updated successfully', 'success');
      updateUser();
    } catch (error) {
      console.error("Update failed:", error.response?.data);
      addToast('Failed to update profile: ' + (error.response?.data?.message || 'Server error'), 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This will delete all your messages and cannot be undone.")) {
      try {
        await axios.delete('http://localhost:5000/api/users/delete', { withCredentials: true });
        addToast('Account deleted successfully', 'success');
        await signOut();
        navigate('/login');
      } catch (error) {
        console.error("Deletion failed:", error.response?.data);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Save className="w-4 h-4" />
              Update Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Danger Zone</h2>
              <p className="text-sm text-gray-600">
                This will permanently delete your account, including all your conversations. This action cannot be undone.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfilePage;