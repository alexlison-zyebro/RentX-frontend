import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ListPlus, DollarSign, TrendingUp,
  LogOut, Menu, X, Home, 
  Building2, ShoppingBag, BarChart3, Clock,
  CheckCircle, XCircle, Eye, Edit, Trash2, Plus
} from 'lucide-react';

const SellerHome = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userName] = useState(localStorage.getItem('userName') || 'Seller');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    activeListings: 0,
    totalEarnings: 0,
    totalRentals: 0,
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to access seller panel.');
      navigate('/login');
      return;
    }

    if (!userRoles.includes('SELLER')) {
      alert('Unauthorized access. Seller privileges required.');
      navigate('/home');
      return;
    }
    const fetchSellerStats = async () => {
      setIsLoading(true);
      try {
        setStats({
          activeListings: 0,
          totalEarnings: 0,
          totalRentals: 0,
          pendingRequests: 0
        });
      } catch (error) {
        console.error('Error fetching seller stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerStats();
  }, [navigate, userRoles]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'listings', label: 'My Listings', icon: <Package className="w-5 h-5" /> },
    { id: 'add-listing', label: 'Add Listing', icon: <ListPlus className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
  ];

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading seller dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">Welcome, {userName}!</h1>
              <p className="text-orange-100">Manage your tool rentals and earnings from here.</p>
            </div>
            <Building2 className="w-16 h-16 opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Listings</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.activeListings}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Tools available for rent</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <h3 className="text-3xl font-black text-gray-900">₹{stats.totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Earned from rentals</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rentals</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalRentals}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Completed bookings</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.pendingRequests}</h3>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Awaiting confirmation</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveTab('add-listing')}
              className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-center"
            >
              <Plus className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="font-semibold text-orange-700">Add New Listing</div>
              <div className="text-sm text-orange-600">List your tool for rent</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('listings')}
              className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center"
            >
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-700">Manage Listings</div>
              <div className="text-sm text-blue-600">View & edit your tools</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('earnings')}
              className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-center"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-700">View Earnings</div>
              <div className="text-sm text-green-600">Track your income</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Activity Yet</h3>
          <p className="text-gray-600 mb-6">Start listing your tools to see activity here.</p>
          <button 
            onClick={() => setActiveTab('add-listing')}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
          >
            List Your First Tool
          </button>
        </div>
      </div>
    );
  };

  const renderListings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">My Listings</h3>
        <button 
          onClick={() => setActiveTab('add-listing')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </button>
      </div>
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet</h4>
        <p className="text-gray-600 mb-6">Start earning by listing your tools for rent.</p>
        <button 
          onClick={() => setActiveTab('add-listing')}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
        >
          Create Your First Listing
        </button>
      </div>
    </div>
  );

  const renderAddListing = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name</label>
          <input
            type="text"
            placeholder="e.g., DeWalt Cordless Drill"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Price (₹)</label>
          <input
            type="number"
            placeholder="e.g., 299"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Describe your tool, its condition, and any special features..."
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="">Select Category</option>
            <option value="drills">Power Drills</option>
            <option value="saws">Saws</option>
            <option value="grinders">Grinders</option>
            <option value="sanders">Sanders</option>
            <option value="painting">Painting Tools</option>
            <option value="welding">Welding Equipment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="Your city/town"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button 
          onClick={() => setActiveTab('listings')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors">
          Create Listing
        </button>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h3>
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h4>
        <p className="text-gray-600">Booking requests will appear here once customers rent your tools.</p>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Earnings Overview</h3>
        <div className="text-sm text-gray-600">
          Total: <span className="text-2xl font-black text-green-600">₹0</span>
        </div>
      </div>
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">No Earnings Yet</h4>
        <p className="text-gray-600 mb-6">Start earning by renting out your tools.</p>
        <button 
          onClick={() => setActiveTab('add-listing')}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
        >
          List a Tool to Start Earning
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'listings':
        return renderListings();
      case 'add-listing':
        return renderAddListing();
      case 'bookings':
        return renderBookings();
      case 'earnings':
        return renderEarnings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-300
        w-64
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900">Rent<span className="text-orange-600">X</span></div>
              <div className="text-xs font-semibold text-orange-600">Seller Panel</div>
            </div>
          </div>
        </div>

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

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 capitalize">{activeTab.replace('-', ' ')}</h1>
                <p className="text-sm text-gray-600">Manage your tool rentals</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/home')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </button>
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

        <div className="flex-1 p-6">
          {renderTabContent()}
        </div>

        <footer className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2026 RentX Seller Panel. All rights reserved.
            </div>
            <div className="text-sm text-gray-600">
              Seller Account
            </div>
          </div>
        </footer>
      </div>

      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerHome;