import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ListPlus, DollarSign, TrendingUp,
  LogOut, Menu, X, Home,
  Building2, ShoppingBag, BarChart3, Clock,
  Plus, CheckCircle, Shield,
  Crown, CreditCard,
  Award
} from 'lucide-react';
import ProductManagement from './ProductManagement';
import RentalActions from './RentalActions';

const SellerHome = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userName] = useState(localStorage.getItem('userName') || 'Seller');
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const [stats, setStats] = useState({
    activeListings: 0,
    totalEarnings: 0,
    totalRentals: 0,
    pendingRequests: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const rolesStr = localStorage.getItem('roles') || '[]';
    let roles = [];
    try {
      roles = JSON.parse(rolesStr);
    } catch (e) {
      console.log("error->", e);
      navigate('/home');
      return;
    }

    if (!roles.includes('SELLER')) {
      navigate('/home');
      return;
    }

    let userId = localStorage.getItem('userId');
    if (userId && userId.includes('"')) {
      userId = userId.replace(/"/g, '').trim();
      localStorage.setItem('userId', userId);
    }

    // Load subscription status
    fetchSubscriptionStatus();

    // Fetch stats
    setIsLoading(false);
    setStats({
      activeListings: 0,
      totalEarnings: 0,
      totalRentals: 0,
      pendingRequests: 0
    });
  }, [navigate]);

  const fetchSubscriptionStatus = async () => {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    try {
      userId = userId.replace(/"/g, '').trim();

      const response = await fetch('http://localhost:4000/api/seller/subscription/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();

      if (result.status === 'SUCCESS') {
        const data = result.data;

        if (data.isSubscribed === true) {
          // Check if subscription is still valid
          if (data.subscriptionEndDate) {
            const endDate = new Date(data.subscriptionEndDate);
            const now = new Date();
            if (endDate > now) {
              setSubscriptionStatus('active');
              localStorage.setItem('subscriptionStatus', 'active');
            } else {
              setSubscriptionStatus('expired');
              localStorage.setItem('subscriptionStatus', 'expired');
            }
          } else {
            setSubscriptionStatus('active');
            localStorage.setItem('subscriptionStatus', 'active');
          }
        } else {
          setSubscriptionStatus('none');
          localStorage.setItem('subscriptionStatus', 'none');
        }
      }
    } catch (error) {
      console.log("error->", error);
      const saved = localStorage.getItem('subscriptionStatus') || 'none';
      setSubscriptionStatus(saved);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setSubscriptionMessage('Please login again');
      return;
    }

    setIsProcessing(true);
    setSubscriptionMessage('');

    try {
      userId = userId.replace(/"/g, '').trim();

      const response = await fetch('http://localhost:4000/api/seller/subscription/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();

      if (result.status === 'SUCCESS') {
        setSubscriptionMessage('Subscription activated successfully!');
        setSubscriptionStatus('active');
        localStorage.setItem('subscriptionStatus', 'active');

        setTimeout(() => {
          setShowSubscriptionModal(false);
          fetchSubscriptionStatus();
        }, 2000);

      } else if (result.status === 'ALREADY_SUBSCRIBED') {
        setSubscriptionMessage('You already have an active subscription!');
        setSubscriptionStatus('active');
        localStorage.setItem('subscriptionStatus', 'active');

        setTimeout(() => {
          setShowSubscriptionModal(false);
          fetchSubscriptionStatus();
        }, 2000);

      } else if (result.status === 'NOT_SELLER') {
        setSubscriptionMessage('Only sellers can subscribe');
      } else if (result.status === 'USER_NOT_FOUND') {
        setSubscriptionMessage('User not found');
      } else {
        setSubscriptionMessage(result.message || 'Subscription failed');
      }
    } catch (error) {
      console.log("error->", error);

      setSubscriptionMessage('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'listings', label: 'My Listings', icon: <Package className="w-5 h-5" /> },
    { id: 'Rentals', label: 'Rentals', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
  ];

  const renderSubscriptionBanner = () => {
    if (subscriptionStatus === 'active') return null;

    return (
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {subscriptionStatus === 'expired' ? 'Subscription Expired' : 'Upgrade to Seller Pro'}
            </h3>
            <p className="text-orange-100">
              {subscriptionStatus === 'expired'
                ? 'Renew your subscription to continue selling'
                : 'Subscribe to unlock all seller features'
              }
            </p>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="px-6 py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors"
          >
            {subscriptionStatus === 'expired' ? 'Renew Now' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const canAccess = subscriptionStatus === 'active';

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'listings':
        return canAccess ? renderListings() : renderRestricted('listings');
      case 'Rentals':
        return canAccess ? renderRentals() : renderRestricted('Rentals');
      case 'earnings':
        return canAccess ? renderEarnings() : renderRestricted('earnings');
      default:
        return renderDashboard();
    }
  };

  const renderRestricted = (tabName) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Subscription Required</h3>
      <p className="text-gray-600 mb-6">You need an active subscription to access {tabName} features.</p>
      <button
        onClick={() => setShowSubscriptionModal(true)}
        className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
      >
        Subscribe Now
      </button>
    </div>
  );

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
        {renderSubscriptionBanner()}

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">Welcome, {userName}!</h1>
              <p className="text-orange-100">Manage your tool rentals and earnings from here.</p>
              {subscriptionStatus === 'active' && (
                <div className="mt-3 text-sm text-orange-100 bg-white/10 px-3 py-1 rounded-lg inline-block">
                  <span className="font-semibold">Pro Seller</span>
                </div>
              )}
            </div>
            <Building2 className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {subscriptionStatus === 'active' ? (
          <>
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
                </button>

                <button
                  onClick={() => setActiveTab('listings')}
                  className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center"
                >
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-700">Manage Listings</div>
                </button>

                <button
                  onClick={() => setActiveTab('earnings')}
                  className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-center"
                >
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">View Earnings</div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Upgrade to Seller Pro</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Subscribe to unlock unlimited listings, booking management, earnings dashboard, and priority support.
            </p>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderListings = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <ProductManagement />
    </div>
  );


  const renderRentals = () => (
     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    <RentalActions />
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
        <DollarSign className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h4 className="text-xl font-bold text-gray-900 mb-3">No Earnings Yet</h4>
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

  const SubscriptionModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" />
              <h2 className="text-xl font-bold">
                {subscriptionStatus === 'expired' ? 'Renew Subscription' : 'Subscribe to Seller Pro'}
              </h2>
            </div>
            <button onClick={() => setShowSubscriptionModal(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {subscriptionMessage && (
            <div className={`mb-4 p-3 rounded-lg ${subscriptionMessage.includes('successfully') ? 'bg-green-50 text-green-700' :
                subscriptionMessage.includes('already') ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
              }`}>
              {subscriptionMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
              <div className="text-center mb-4">
                <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Pro Plan</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-orange-600">₹699</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <div className="bg-white border border-orange-300 rounded-lg p-2">
                  <div className="text-xs text-gray-700">Cancel anytime</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">What's included:</h4>
              {['Unlimited product listings', 'Booking management', 'Earnings dashboard', 'Priority support', 'Secure payments'].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || subscriptionStatus === 'active'}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2
                ${subscriptionStatus === 'active'
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-70'
                }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : subscriptionStatus === 'active' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Already Subscribed
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {subscriptionStatus === 'expired' ? 'Renew - ₹699' : 'Subscribe - ₹699'}
                </>
              )}
            </button>

            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
            >
              {subscriptionStatus === 'active' ? 'Close' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
              disabled={subscriptionStatus !== 'active' && item.id !== 'dashboard'}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                }
                ${subscriptionStatus !== 'active' && item.id !== 'dashboard' ? 'opacity-50 cursor-not-allowed' : ''}
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
              {subscriptionStatus === 'active' ? 'Active Subscription' : 'Subscription Required'}
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
      {showSubscriptionModal && <SubscriptionModal />}
    </div>
  );
};

export default SellerHome;