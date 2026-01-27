import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, MapPin, Star, Heart, User, LogOut, Menu, X, 
  ShoppingBag, Package, Shield, Clock, Zap, Award, 
  ChevronRight, Filter, ArrowRight, RefreshCw, TrendingUp,
  Users, Sparkles, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [userName] = useState(localStorage.getItem('userName') || 'User');
  const [userEmail] = useState(localStorage.getItem('email') || 'user@example.com');
  
  const [userRoles] = useState(() => {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return [];
    try {
      const roles = JSON.parse(rolesStr);
      return Array.isArray(roles) ? roles : [roles];
    } catch (e) {
      console.log("error->", e);
      return [];
    }
  });

  const [activeRole, setActiveRole] = useState(() => {
    return userRoles.includes('SELLER') ? 'seller' : 'buyer';
  });

  const canSwitchRoles = userRoles.includes('BUYER') && userRoles.includes('SELLER');

  useEffect(() => {
    if (!token) {
      alert('Please login to access this page.');
      navigate('/login');
      return;
    }

    const hasBuyer = userRoles.includes('BUYER');
    const hasOnlyBuyerOrSeller = userRoles.every(role => role === 'BUYER' || role === 'SELLER');

    if (!hasBuyer || !hasOnlyBuyerOrSeller || userRoles.length === 0) {
      alert('Unauthorized access. Only buyers and sellers can access this page.');
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [token, userRoles, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdown && !event.target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleRole = () => {
    setActiveRole(activeRole === 'buyer' ? 'seller' : 'buyer');
  };

  const featuredTools = [
    { id: 1, name: 'DeWalt Cordless Drill Kit', price: 299, rating: 4.9, reviews: 342, location: 'Kochi', image: '🔧', category: 'Drilling', seller: 'ProTools Hub', available: true },
    { id: 2, name: 'Bosch Angle Grinder', price: 349, rating: 4.8, reviews: 256, location: 'Ernakulam', image: '⚙️', category: 'Grinding', seller: 'ToolMasters', available: true },
    { id: 3, name: 'Makita Impact Wrench', price: 399, rating: 4.9, reviews: 189, location: 'Thrippunithura', image: '🔨', category: 'Fastening', seller: 'Rental Pro', available: false },
    { id: 4, name: 'Milwaukee Circular Saw', price: 449, rating: 5.0, reviews: 421, location: 'Kakkanad', image: '🪚', category: 'Cutting', seller: 'BuildTech', available: true },
    { id: 5, name: 'Ryobi Jigsaw Pro', price: 279, rating: 4.7, reviews: 198, location: 'Aluva', image: '✂️', category: 'Cutting', seller: 'ToolZone', available: true },
    { id: 6, name: 'Wagner Paint Sprayer', price: 329, rating: 4.8, reviews: 267, location: 'Kochi', image: '🎨', category: 'Painting', seller: 'PaintPro', available: true },
  ];

  const categories = [
    { name: 'Power Drills', icon: '🔧', count: 128 },
    { name: 'Grinders', icon: '⚙️', count: 94 },
    { name: 'Saws', icon: '🪚', count: 156 },
    { name: 'Sanders', icon: '📐', count: 87 },
    { name: 'Painting', icon: '🎨', count: 72 },
    { name: 'Welding', icon: '🔩', count: 63 },
  ];

  if (userRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-orange-600 text-xl font-bold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900">Rent<span className="text-orange-600">X</span></span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <a href="#browse" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">Browse</a>
              <a href="#categories" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">Categories</a>
              <a href="#about" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">About Us</a>
              {activeRole === 'seller' && (
                <a href="#my-listings" className="text-base font-medium text-gray-700 hover:text-orange-600 transition-colors">My Listings</a>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {canSwitchRoles && (
                <button
                  onClick={toggleRole}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all border border-gray-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  {activeRole === 'buyer' ? 'Seller' : 'Buyer'} Mode
                </button>
              )}
              
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">{userName}</div>
                    <div className="text-xs font-semibold text-orange-600 capitalize">{activeRole}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${profileDropdown ? 'rotate-90' : ''}`} />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{userName}</div>
                          <div className="text-sm text-gray-600">{userEmail}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <a
                        href="/profile/edit"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <Edit className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Edit Profile</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenu && (
            <div className="lg:hidden py-4 space-y-1 border-t bg-white">
              <a href="#browse" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Browse</a>
              <a href="#categories" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Categories</a>
              <a href="#about" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">About Us</a>
              {activeRole === 'seller' && (
                <a href="#my-listings" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">My Listings</a>
              )}
              {canSwitchRoles && (
                <button onClick={() => { toggleRole(); setMobileMenu(false); }} className="w-full px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Switch to {activeRole === 'buyer' ? 'Seller' : 'Buyer'}
                </button>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="px-4 py-3 bg-orange-50 rounded-lg mb-2">
                  <div className="font-bold text-gray-900">{userName}</div>
                  <div className="text-sm text-gray-600">{userEmail}</div>
                  <div className="text-sm text-orange-600 font-semibold capitalize mt-1">{activeRole}</div>
                </div>
                <a href="/profile/edit" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </a>
                <button onClick={handleLogout} className="w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">Welcome back, {userName}!</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {activeRole === 'buyer' ? (
                <>Find the <span className="text-orange-600">Perfect Tool</span></>
              ) : (
                <>List Your Tools &<br /><span className="text-orange-600">Start Earning</span></>
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              {activeRole === 'buyer' 
                ? 'Access professional-grade power tools without the commitment. Rent from verified local sellers and complete your projects efficiently.'
                : 'Turn your idle equipment into a steady income stream. List your tools and connect with local renters today.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for power tools..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full md:w-48 pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <button className="px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-20">
            <div className="bg-white rounded-2xl p-3 shadow-lg border py-10 border-gray-200 text-center hover:shadow-xl transition-shadow">
              <Zap className="w-10 h-10 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-black text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Tools Available</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <Award className="w-10 h-10 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-black text-gray-900">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <Shield className="w-10 h-10 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-black text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Verified Sellers</div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find exactly what you need for your project</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <button key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-600 group">
                <div className="text-5xl mb-4">{cat.icon}</div>
                <div className="font-bold text-gray-900 mb-2 text-lg">{cat.name}</div>
                <div className="text-sm text-gray-600">{cat.count} tools</div>
              </button>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#all-categories" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:underline">
              View All Categories <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <section id="browse" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Tools</h2>
              <p className="text-gray-600">Top-rated equipment available near you</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-orange-600 transition-all">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-7xl">
                    {tool.image}
                  </div>
                  {!tool.available && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <span className="bg-white px-4 py-2 rounded-full font-bold text-gray-900 text-sm">Currently Unavailable</span>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-orange-50 transition-all">
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                        <MapPin className="w-4 h-4" />
                        {tool.location}
                      </p>
                      <p className="text-xs text-gray-500">by {tool.seller}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-600">₹{tool.price}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{tool.rating}</span>
                      <span className="text-gray-500">({tool.reviews})</span>
                    </div>
                    <div className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">
                      {tool.category}
                    </div>
                  </div>

                  <button
                    disabled={!tool.available}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      tool.available
                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/30'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {tool.available ? 'Rent Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl">
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">About RentX</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Your trusted powertools marketplace connecting renters and owners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">Making professional tools accessible to everyone while helping owners earn from their idle equipment.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community First</h3>
              <p className="text-gray-600 leading-relaxed">Building a trusted community of verified sellers and satisfied renters across India.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">Every tool and seller is verified to ensure you get the best rental experience.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
            <h3 className="text-3xl font-black text-gray-900 mb-4">Why Choose RentX?</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              RentX is India's leading powertools rental marketplace. We connect people who need professional tools for their projects with owners who want to earn from their equipment. With verified sellers, secure transactions, and 24/7 support, we make tool rental simple, safe, and affordable.
            </p>
          </div>
        </div>
      </section>

      {activeRole === 'seller' && (
        <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-orange-700">
          <div className="max-w-4xl mx-auto text-center">
            <Package className="w-16 h-16 mx-auto mb-6 text-white opacity-90" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to List Your Tools?</h2>
            <p className="text-xl text-orange-100 mb-8">Start earning by renting out your power tools. It's quick, easy, and profitable!</p>
            <button className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl">
              <Package className="w-5 h-5" />
              Add New Listing
            </button>
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black">Rent<span className="text-orange-600">X</span></span>
          </div>
          <p className="text-gray-400 mb-6">Your trusted powertools marketplace</p>
          <p className="text-gray-500 text-sm">© 2026 RentX. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;