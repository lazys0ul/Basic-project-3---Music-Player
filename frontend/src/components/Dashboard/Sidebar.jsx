import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaMusic, 
  FaUpload, 
  FaSignOutAlt, 
  FaHome,
  FaCompactDisc,
  FaCog,
  FaUser,
  FaTimes
} from 'react-icons/fa';
import { ResonaLogo } from '../../assets/resona-brand.jsx';

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      id: 'library',
      label: 'Music Library',
      icon: FaCompactDisc,
      description: 'Browse your collection'
    },
    {
      id: 'upload',
      label: 'Upload Music',
      icon: FaUpload,
      description: 'Add new tracks'
    }
  ];

  return (
    <div className="w-80 glass-card border-r border-gray-700/50 flex flex-col relative overflow-hidden h-full">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-pink-500/5"></div>
      
      {/* Mobile Close Button */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <FaTimes size={18} />
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Enhanced Logo Section */}
        <div className="p-8 border-b border-gray-700/30">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <ResonaLogo size={40} />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg opacity-10 blur-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Resona
              </h1>
              <p className="text-sm text-gray-400">Music Studio</p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {/* Button glow effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl"></div>
                    )}
                    
                    <div className="relative flex items-center space-x-4 p-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                      }`}>
                        <Icon className="text-xl" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base">{item.label}</div>
                        <div className={`text-sm transition-colors ${
                          isActive ? 'text-white/70' : 'text-gray-500 group-hover:text-gray-400'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Enhanced User Profile & Logout */}
        <div className="p-6 border-t border-gray-700/30">
          {/* User Profile Card */}
          <div className="glass-card p-4 rounded-2xl mb-4 border border-gray-600/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
              <span>Premium User</span>
              <span>Online</span>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-gray-700/30 hover:border-red-500/30"
          >
            <FaSignOutAlt />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default memo(Sidebar);