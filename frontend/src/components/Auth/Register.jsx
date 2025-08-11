import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash, FaMusic, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { ResonaLogo } from '../../assets/resona-brand.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, loading } = useAuth();
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

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900"></div>
      
      {/* Floating music notes decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-4 h-4 text-purple-500/20 animate-pulse">
          <FaMusic />
        </div>
        <div className="absolute top-32 right-24 w-6 h-6 text-pink-500/20 animate-pulse" style={{animationDelay: '1s'}}>
          <FaMusic />
        </div>
        <div className="absolute bottom-28 left-24 w-5 h-5 text-blue-500/20 animate-pulse" style={{animationDelay: '2s'}}>
          <FaMusic />
        </div>
        <div className="absolute bottom-16 right-16 w-4 h-4 text-purple-500/20 animate-pulse" style={{animationDelay: '3s'}}>
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
              Join Resona
            </h1>
            <p className="text-gray-400 text-xs">Create your music universe</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm touch-manipulation text-sm ${
                    errors.username ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center">
                  <span className="w-3 h-3 mr-1">⚠</span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
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
                  className={`w-full pl-10 pr-3 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm touch-manipulation text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-600/50'
                  }`}
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

            {/* Password Field */}
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
                  className={`w-full pl-10 pr-10 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm touch-manipulation text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-600/50 active:scale-95 touch-manipulation"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm touch-manipulation text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-600/50 active:scale-95 touch-manipulation"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full neo-button py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-6 h-6 mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Enhanced Footer */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-gray-400">Already have an account?</span>
              </div>
            </div>
            
            <Link
              to="/login"
              className="mt-3 inline-block text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 text-sm"
            >
              Sign in instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;