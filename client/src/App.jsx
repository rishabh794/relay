import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuth } from './context/useAuth';
import ChatPage from './pages/ChatPage'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  if (isLoading) {
    return <p>Loading session...</p>;
  }

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1-px solid #ccc' }}>
        {user ? (
          <>
            <Link to="/">Home</Link> | <span>Welcome, {user.name}! </span> | <Link to="/chat">Chat</Link>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;