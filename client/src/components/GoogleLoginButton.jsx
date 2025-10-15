import { createAuthClient } from 'better-auth/client';

const GoogleLoginButton = () => {
  const authClient = createAuthClient({
    baseURL: 'http://localhost:5000',
  });

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: 'google',
    });
  };

  return (
    <button onClick={handleGoogleLogin} style={{ padding: '10px', fontSize: '16px' }}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;