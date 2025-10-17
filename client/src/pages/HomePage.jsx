import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 
import { MessageCircle, ArrowRight, Lock, Zap } from 'lucide-react';

const HomePage = () => {
  const { updateUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isSocialLoginRedirect = searchParams.get('token') || searchParams.get('code');

    if (isSocialLoginRedirect) {
      console.log('✅ Social login redirect detected. Refreshing session...');
      updateUser();
      window.history.replaceState({}, document.title, "/");
    }
  }, [location, updateUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6">
              <MessageCircle className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to ChatApp
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect, communicate, and collaborate seamlessly. Your conversations are just a click away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Messaging</h3>
              <p className="text-sm text-gray-600">Real-time conversations with friends and colleagues</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">End-to-end encryption for your peace of mind</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Optimized performance for smooth experience</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to start chatting?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of users already connected through our platform
            </p>
            <button 
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 ChatApp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;