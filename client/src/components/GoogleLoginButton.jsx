import { useAuth } from '../context/useAuth';

const GoogleLoginButton = () => {
  const { signInSocial } = useAuth();

  const handleGoogleLogin = async () => {
    await signInSocial('google');
  };

  return (
    <button onClick={handleGoogleLogin} style={{ padding: '10px', fontSize: '16px' }}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;