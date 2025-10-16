import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      console.log('✅ Google login successful! Token:', token);
      localStorage.setItem('authToken', token);
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  return (
    <div>
      <h1>Home Page</h1>
      <p>If you just logged in with Google, your token is in the console and saved!</p>
    </div>
  );
};

export default HomePage;