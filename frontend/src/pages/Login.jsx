import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // New Import
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store';
import { authAPI } from '../api/auth.api';
import Logo from '../components/common/Logo';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Handle Standard Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.accessToken);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      // 'credential' is the JWT ID Token from Google
      const response = await authAPI.GoogleLogin(credentialResponse.credential);
      
      // Update store and navigate (matching your handleSubmit logic)
      login(response.user, response.accessToken);
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-secondary to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo variant="premium" size="xl" />
          </Link>
        </div>

        <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to continue watching</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                  <svg className="absolute right-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="relative w-full pl-12 pr-4 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                  <svg className="absolute right-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="relative w-full pl-12 pr-12 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 text-red-600 focus:ring-red-600 focus:ring-offset-0 bg-dark" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-red-500 hover:text-red-400 transition-colors font-medium">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="relative w-full group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                {loading ? <span className="flex items-center gap-2 animate-pulse">Processing...</span> : <span>Sign In</span>}
              </div>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center"><span className="px-4 text-sm text-gray-500 bg-dark-secondary">Or continue with</span></div>
          </div>

          {/* UPDATED SOCIAL LOGIN SECTION */}
<div className="flex flex-col gap-4 items-center">
  {/* Google Login Component */}
  <div className="w-full flex justify-center">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => toast.error("Google login failed")}
      useOneTap
      theme="filled_black"
      shape="pill"
      width="100%"
    />
  </div>

  {/* GitHub Button has been removed */}
</div>

          <p className="text-center mt-8 text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-medium transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}