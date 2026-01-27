import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, 
  LogOut, Menu, X,
  Building2, 
  BarChart3, Shield, ShoppingBag, Calendar
} from 'lucide-react';

const AdminHome = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userName] = useState(localStorage.getItem('userName') || 'Admin');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    pendingRequests: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRoles] = useState(() => {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return [];
    try {
      return JSON.parse(rolesStr);
    } catch (e) {
      console.log(e);
      return [];
    }
  });

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to access admin panel.');
      navigate('/login');
      return;
    }

    if (!userRoles.includes('ADMIN')) {
      alert('Unauthorized access. Admin privileges required.');
      navigate('/home');
      return;
    }

    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Mock empty data for now
        setStats({
          totalUsers: 0,
          totalBuyers: 0,
          totalSellers: 0,
          pendingRequests: 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate, userRoles]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'requests', label: 'Requests', icon: <Shield className="w-5 h-5" /> },
    { id: 'buyers', label: 'Buyers', icon: <Users className="w-5 h-5" /> },
    { id: 'sellers', label: 'Sellers', icon: <Package className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  ];

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">Welcome back, {userName}!</h1>
              <p className="text-orange-100">Here's what's happening with your platform today.</p>
            </div>
            <Building2 className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Registered platform users</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Buyers</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalBuyers.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Active buyers on platform</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sellers</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalSellers.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Registered sellers</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.pendingRequests}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Requiring your attention</div>
            </div>
          </div>
        </div>

        {/* Empty State for Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h3>
          <p className="text-gray-600 mb-6">Data will appear here once users start using the platform.</p>
          <button className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors">
            Refresh Data
          </button>
        </div>
      </div>
    );
  };

  const renderRequests = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Verification Requests</h3>
      <p className="text-gray-600 mb-6">Manage user verification requests here.</p>
      <div className="text-sm text-gray-500">No pending requests at the moment.</div>
    </div>
  );

  const renderBuyers = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">Buyers Management</h4>
      <p className="text-gray-600">Buyer data will appear here once users register.</p>
    </div>
  );

  const renderSellers = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-gray-400" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">Sellers Management</h4>
      <p className="text-gray-600">Seller data will appear here once sellers register.</p>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-10 h-10 text-gray-400" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">Bookings Management</h4>
      <p className="text-gray-600">Booking data will appear here once users start renting tools.</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'requests':
        return renderRequests();
      case 'buyers':
        return renderBuyers();
      case 'sellers':
        return renderSellers();
      case 'bookings':
        return renderBookings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-300
        w-64
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900">Rent<span className="text-orange-600">X</span></div>
              <div className="text-xs font-semibold text-orange-600">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-orange-50 text-orange-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-gray-600">Manage your platform</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - This will grow and push footer down */}
        <div className="flex-1 p-6">
          {renderTabContent()}
        </div>

        {/* Footer - This will stay at bottom */}
        <footer className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2026 RentX Admin Panel. All rights reserved.
            </div>
            <div className="text-sm text-gray-600">
              Version 1.0.0
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminHome;