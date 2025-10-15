import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/sign-in/email',
        formData
      );
      const token = response.data.accessToken;
      console.log('Login successful! Token:', token);
      localStorage.setItem('authToken', token);
      navigate('/'); 
    } catch (error) {
      console.error('Login failed:', error.response.data);
      alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="text" placeholder="Email or Phone" onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
        <button type="submit">Log In</button>
      </form>
      <hr />
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;