import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE } from '../../utils/constants';
import { 
  FaUsers, 
  FaMusic, 
  FaCrown, 
  FaTrash, 
  FaUserShield,
  FaUser,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMusic: 0,
    totalAdmins: 0,
    recentUsers: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      window.location.href = '/dashboard';
      return;
    }
  }, [user]);

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async (page = 1, search = '') => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`${API_BASE}/admin/users`, {
        params: {
          page,
          limit: 10,
          search
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(`${API_BASE}/admin/users/${userId}/role`, {
        role: newRole
      });
      
      if (response.data.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers(currentPage, searchQuery);
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  // Delete user
  const deleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their uploaded music.`)) {
      return;
    }
    
    try {
      const response = await axios.delete(`${API_BASE}/admin/users/${userId}`);
      
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(currentPage, searchQuery);
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchQuery);
  };

  // Initialize data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchUsers();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            👑 Admin Panel
          </h1>
          <p className="text-gray-400">
            Manage users and platform content
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
          <FaCrown className="text-yellow-400" />
          <span className="text-yellow-400 font-medium">Admin Access</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">
                {loading ? <FaSpinner className="animate-spin" /> : stats.totalUsers}
              </p>
            </div>
            <FaUsers className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Music</p>
              <p className="text-3xl font-bold text-white">
                {loading ? <FaSpinner className="animate-spin" /> : stats.totalMusic}
              </p>
            </div>
            <FaMusic className="text-4xl text-purple-500" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-3xl font-bold text-white">
                {loading ? <FaSpinner className="animate-spin" /> : stats.totalAdmins}
              </p>
            </div>
            <FaCrown className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-lg font-bold text-green-400 flex items-center">
                <FaCheckCircle className="mr-2" />
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="glass-card p-6 rounded-2xl border border-gray-600/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">User Management</h2>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-purple-500 mx-auto" />
                    <p className="text-gray-400 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <FaUsers className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData._id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {userData.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{userData.username}</p>
                          <p className="text-gray-400 text-sm">{userData.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        userData.role === 'admin' 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {userData.role === 'admin' ? '👑 Admin' : '🎵 User'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-400 text-sm">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {/* Role Toggle */}
                        <button
                          onClick={() => updateUserRole(
                            userData._id, 
                            userData.role === 'admin' ? 'user' : 'admin'
                          )}
                          className={`p-2 rounded-lg transition-colors ${
                            userData.role === 'admin'
                              ? 'text-yellow-400 hover:bg-yellow-500/20'
                              : 'text-blue-400 hover:bg-blue-500/20'
                          }`}
                          title={userData.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {userData.role === 'admin' ? <FaUser /> : <FaUserShield />}
                        </button>

                        {/* Delete User */}
                        {userData._id !== user.id && (
                          <button
                            onClick={() => deleteUser(userData._id, userData.username)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/30">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchUsers(currentPage - 1, searchQuery)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => fetchUsers(currentPage + 1, searchQuery)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
