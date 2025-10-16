import { authClient } from '../lib/auth-client';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
    const session = authClient.useSession();

  const signUpEmail = async (formData) => {
    return authClient.signUp.email(formData);
  };

  const signInEmail = async (credentials) => {
    return authClient.signIn.email(credentials);
  };

  const signInSocial = async (provider) => {
    return authClient.signIn.social({ provider });
  };

  const signOut = async () => {
    return authClient.signOut();
  };
  
  const updateUser = async () => {
  return await session.refetch();
};

  const value = {
    user: session.data?.user || null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    
    signUpEmail,
    signInEmail,
    signInSocial,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};