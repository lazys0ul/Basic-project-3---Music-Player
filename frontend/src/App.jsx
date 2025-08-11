import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const MusicPlayer = lazy(() => import('./components/Player/MusicPlayer'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Public Music Library Route (accessible to everyone)
const PublicLibraryRoute = ({ children }) => {
  return children; // Always accessible
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MusicProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden overscroll-none">
              {/* Enhanced background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/login" 
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      } 
                    />
                    
                    {/* Public Music Library - accessible to everyone */}
                    <Route 
                      path="/library" 
                      element={
                        <PublicLibraryRoute>
                          <Dashboard publicView={true} />
                        </PublicLibraryRoute>
                      } 
                    />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Default Route - Load Library */}
                    <Route path="/" element={<Navigate to="/library" />} />
                  </Routes>
                </Suspense>
                
                {/* Global Music Player */}
                <Suspense fallback={null}>
                  <MusicPlayer />
                </Suspense>
              </div>
              
              {/* Enhanced Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="glass-card"
                style={{
                  top: '1rem',
                  right: '1rem'
                }}
              />
            </div>
          </Router>
        </MusicProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;