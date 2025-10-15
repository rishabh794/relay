import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/sign-up/email',
        formData
      );
      console.log('Signup successful:', response.data);
      alert('Signup successful! Please log in.');
      navigate('/login'); 
    } catch (error) {
      console.error('Signup failed:', error.response.data);
      alert('Signup failed: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Name" onChange={handleChange} required /><br/>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br/>
        <input name="phoneNumber" type="text" placeholder="Phone Number" onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;