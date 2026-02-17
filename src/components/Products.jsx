import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Filter, X, Calendar,
  Search, MapPin, User, Mail, Phone,
  Building, Sliders, DollarSign, Store, Home
} from 'lucide-react';
import axios from 'axios';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRentForm, setShowRentForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const BASE_URL = 'http://localhost:4000/api';

  const headers = { 
    'token': token,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/categories/all`, {}, { headers });
        if (response.data?.status === 'SUCCESS') {
          setCategories(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/allProducts`, {}, { headers });
      if (response.data?.status === 'SUCCESS') {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      console.log('Fetching product with ID:', productId);
      console.log('Using token:', token);
      
      const response = await axios.get(
        `${BASE_URL}/productById/${productId}`,
        { 
          headers: {
            'token': token
          }
        }
      );
      
      console.log('Product response:', response.data);
      return response.data?.status === 'SUCCESS' ? response.data.data : null;
    } catch (err) {
      console.error('Error fetching product:', err.response?.data || err.message);
      return null;
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setIsFilterOpen(false);
      
      const searchParams = {};
      if (searchName) searchParams.name = searchName;
      if (selectedCategory) searchParams.categoryId = selectedCategory;
      if (city) searchParams.city = city;
      if (state) searchParams.state = state;
      if (pincode) searchParams.pincode = pincode;
      if (minPrice) searchParams.minPrice = minPrice;
      if (maxPrice) searchParams.maxPrice = maxPrice;

      const response = await axios.post(`${BASE_URL}/searchProduct`, searchParams, { headers });
      if (response.data?.status === 'SUCCESS') {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (token) {
      fetchProducts(); 
    }
  }, [token]);

  const clearFilters = () => {
    setSearchName('');
    setSelectedCategory('');
    setCity('');
    setState('');
    setPincode('');
    setMinPrice('');
    setMaxPrice('');
    fetchProducts();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleRentClick = async (product) => {
    try {
      setSelectedProduct(product);
      setLoading(true);
      
      if (!token) {
        alert('Please login to rent products');
        return;
      }
      
      const details = await fetchProductById(product._id);
      console.log('Product details:', details);
      
      if (details) {
        setProductDetails(details);
        setQuantity(1);
        setStartDate('');
        setEndDate('');
        setShowRentForm(true);
      } else {
        alert('Failed to fetch product details. Please try again.');
      }
    } catch (error) {
      console.error('Error in rent click:', error);
      alert('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotal = () => {
    if (!productDetails || !startDate || !endDate) return 0;
    return calculateDays() * (productDetails.pricePerDay || 0) * quantity;
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !startDate || !endDate) {
      alert('Please select both dates');
      return;
    }
    
    try {
      const response = await axios.post(
        `${BASE_URL}/createRequest`,
        { 
          productId: selectedProduct._id, 
          quantity, 
          startDate, 
          endDate 
        },
        { 
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data?.status === 'SUCCESS') {
        alert('Rent request created successfully!');
        fetchProducts();
        setShowRentForm(false);
        setProductDetails(null);
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Error creating rent request:', err);
      alert(err.response?.data?.message || 'Failed to create rent request');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Available Products</h2>
        <p className="text-gray-600 mb-8">Discover premium tools and equipment available for rent</p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tools, equipment, or brands..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-36 py-4 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 shadow-lg"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button onClick={() => setIsFilterOpen(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Filters
              </button>
              <button onClick={handleSearch} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white shadow-md">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsFilterOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Filters</h3>
                  <p className="text-sm text-gray-500">Refine your search</p>
                </div>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><Package className="w-4 h-4" /> Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="">All Categories</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><DollarSign className="w-4 h-4" /> Price per day</label>
                <div className="flex gap-3">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-1/2 p-3 bg-gray-50 border rounded-xl" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-1/2 p-3 bg-gray-50 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"><MapPin className="w-4 h-4" /> Location</label>
                <div className="space-y-3">
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
                  <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
                  <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 w-full p-6 bg-white border-t">
              <div className="flex gap-3">
                <button onClick={clearFilters} className="flex-1 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200">Clear All</button>
                <button onClick={handleSearch} className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 bg-orange-50 rounded-3xl">
          <Package className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Products Found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
          <button onClick={clearFilters} className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl">Clear Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-3xl shadow-lg border hover:shadow-xl transition-all group">
              <div className="relative h-56 bg-gray-50 flex items-center justify-center p-6">
                {product.image ? (
                  <img src={`http://localhost:4000${product.image}`} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category || product.categoryId?.name || 'Uncategorized'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Store className="w-3 h-3" />
                      {product.userId?.sellerDetails?.individualName || product.userId?.sellerDetails?.organizationName || 'Seller'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-orange-600">₹{product.pricePerDay}</div>
                    <div className="text-xs text-gray-500">per day</div>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Available</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    Stock: {product.remaining_quantity}/{product.quantity}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <button 
                  onClick={() => handleRentClick(product)} 
                  className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2 shadow-lg"
                  disabled={loading}
                >
                  <ShoppingBag className="w-5 h-5" /> Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rent Form Popup */}
      {showRentForm && productDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-orange-600" /> Rent Request</h3>
              <button onClick={() => { setShowRentForm(false); setProductDetails(null); }} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Seller Information</h4>
                      <p className="text-xs text-gray-500">Verified Seller</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3"><User className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Seller Name</p><p className="font-semibold">{productDetails.seller?.name || 'N/A'}</p></div></div>
                    <div className="flex gap-3"><Mail className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Email</p><p className="font-medium break-all">{productDetails.seller?.email || 'N/A'}</p></div></div>
                    <div className="flex gap-3"><Phone className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Phone</p><p className="font-medium">{productDetails.seller?.phone || 'N/A'}</p></div></div>
                    <div className="flex gap-3"><Home className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Street</p><p className="font-medium">{productDetails.seller?.street || 'N/A'}</p></div></div>
                    <div className="flex gap-3"><MapPin className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">City/State</p><p className="font-medium">{productDetails.seller?.city || 'N/A'}{productDetails.seller?.city && productDetails.seller?.state ? ', ' : ''}{productDetails.seller?.state || ''}</p></div></div>
                    <div className="flex gap-3"><Building className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Pincode</p><p className="font-medium">{productDetails.seller?.pincode || 'N/A'}</p></div></div>
                    <div className="flex gap-3"><Home className="w-5 h-5 text-orange-600 mt-0.5" /><div><p className="text-sm text-gray-600">Full Address</p><p className="font-medium">{productDetails.seller?.fullAddress || 'N/A'}</p></div></div>
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <div className="flex justify-between"><span className="text-sm text-gray-600">Stock</span><span className="font-bold text-orange-600">{productDetails.remaining_quantity}/{productDetails.quantity} units</span></div>
                      <div className="flex justify-between mt-2"><span className="text-sm text-gray-600">Price</span><span className="font-bold">₹{productDetails.pricePerDay}/day</span></div>
                    </div>
                  </div>
                </div>

                {/* Rental Form */}
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                    {productDetails.image ? (
                      <img src={`http://localhost:4000${productDetails.image}`} alt={productDetails.name} className="w-20 h-20 object-cover rounded-xl" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center"><Package className="w-8 h-8 text-gray-400" /></div>
                    )}
                    <div>
                      <h4 className="font-bold">{productDetails.name}</h4>
                      <p className="text-sm text-gray-600">{productDetails.category}</p>
                      <p className="text-xs text-gray-500 mt-1">Stock: {productDetails.remaining_quantity}/{productDetails.quantity}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-lg font-bold">-</button>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(Math.min(productDetails.remaining_quantity, Math.max(1, parseInt(e.target.value) || 1)))} className="w-20 text-center border rounded-lg py-2" min="1" max={productDetails.remaining_quantity} />
                      <button onClick={() => setQuantity(Math.min(productDetails.remaining_quantity, quantity + 1))} disabled={quantity >= productDetails.remaining_quantity} className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-lg font-bold">+</button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="block mb-2 font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> Start Date</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={getTomorrowDate()} className="w-full border rounded-xl p-3" />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> End Date</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || getTomorrowDate()} disabled={!startDate} className="w-full border rounded-xl p-3 disabled:bg-gray-50" />
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl text-black">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-3xl font-black">₹{calculateTotal()}</span>
                      </div>
                      <div className="text-sm text-black-700">
                        {calculateDays()} days × {quantity} item(s) × ₹{productDetails.pricePerDay}/day
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleSubmit} 
                    disabled={!startDate || !endDate || loading} 
                    className={`w-full py-4 rounded-xl font-bold ${startDate && endDate ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    {startDate && endDate ? 'Send Rent Request' : 'Select Dates'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;