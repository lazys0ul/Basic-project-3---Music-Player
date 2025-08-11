import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash, FaMusic, FaEnvelope, FaLock } from 'react-icons/fa';
import { ResonaLogo } from '../../assets/resona-brand.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900"></div>
      
      {/* Floating music notes decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 text-purple-500/20 animate-pulse">
          <FaMusic />
        </div>
        <div className="absolute top-40 right-32 w-6 h-6 text-pink-500/20 animate-pulse" style={{animationDelay: '1s'}}>
          <FaMusic />
        </div>
        <div className="absolute bottom-32 left-32 w-5 h-5 text-blue-500/20 animate-pulse" style={{animationDelay: '2s'}}>
          <FaMusic />
        </div>
        <div className="absolute bottom-20 right-20 w-4 h-4 text-purple-500/20 animate-pulse" style={{animationDelay: '3s'}}>
          <FaMusic />
        </div>
      </div>
      
      <div className="relative z-10 max-w-xs w-full mx-4 scale-in">
        <div className="glass-card rounded-2xl shadow-2xl p-5 border border-gray-600/30 hover-lift">
          {/* Enhanced Logo and Title */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center mb-3 relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg float">
                <ResonaLogo size={36} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
            </div>
            <h1 className="text-xl font-bold gradient-text mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-xs">Sign in to your music universe</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Development Notice */}
            {import.meta.env.DEV && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
                <h3 className="text-yellow-400 font-medium mb-1 text-sm">⚠️ Development Mode</h3>
                <p className="text-xs text-gray-300">Create an account or use your own credentials to login.</p>
              </div>
            )}

            {/* Enhanced Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center">
                  <span className="w-3 h-3 mr-1">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Enhanced Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center">
                  <span className="w-3 h-3 mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full neo-button py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Enhanced Footer */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-gray-400">New to Resona?</span>
              </div>
            </div>
            
            <Link
              to="/register"
              className="mt-3 inline-block text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 text-sm"
            >
              Create your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
