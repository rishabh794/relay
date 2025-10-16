import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();
  const { signUpEmail , updateUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signUpEmail(formData);

    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      await updateUser();
      navigate('/');
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