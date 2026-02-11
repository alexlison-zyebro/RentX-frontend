import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Star, Heart, Package, Filter,
  Truck, X, Calendar
} from 'lucide-react';
import axios from 'axios';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRentForm, setShowRentForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/allProducts`, 
        {},
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleRentClick = (product) => {
    if (!product.isAvailable) return;
    
    setSelectedProduct(product);
    setQuantity(1);
    setStartDate('');
    setEndDate('');
    setShowRentForm(true);
  };

  const calculateTotal = () => {
    if (!selectedProduct || !startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    
    return days * (selectedProduct.pricePerDay || 0) * quantity;
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    // Validate dates
    if (!startDate) {
      alert('Please select a start date');
      return;
    }
    
    if (!endDate) {
      alert('Please select an end date');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start <= today) {
      alert('Start date must be in the future');
      return;
    }
    
    if (end < start) {
      alert('End date must be on or after start date');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/createRequest`,
        {
          productId: selectedProduct._id,
          quantity: quantity,
          startDate: startDate,
          endDate: endDate
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        alert('Rent request created successfully!');
        fetchProducts();
        setShowRentForm(false);
      } else {
        alert(response.data?.message || 'Failed to create rent request');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create rent request';
      alert(errorMsg);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    const maxQty = selectedProduct?.remaining_quantity || 0;
    if (numValue < 1) {
      setQuantity(1);
    } else if (numValue > maxQty) {
      setQuantity(maxQty);
    } else {
      setQuantity(numValue);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    const maxQty = selectedProduct?.remaining_quantity || 0;
    if (quantity < maxQty) {
      setQuantity(quantity + 1);
    }
  };



  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (products.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Products</h2>
        <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100">
          <Package className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-500">Products will appear here once sellers add them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Simple Rent Popup */}
      {showRentForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg ms-40 bg-orange-100 px-5 py-2 rounded-lg mb-3 font-bold">Rent Request</h3>
                <button 
                  type="button"
                  onClick={() => setShowRentForm(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  {selectedProduct.image ? (
                    <img 
                      src={`http://localhost:4000${selectedProduct.image}`}
                      alt={selectedProduct.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{selectedProduct.name}</h4>
                    <p className="text-gray-600">₹{selectedProduct.pricePerDay || 0}/day</p>
                    <p className="text-sm text-gray-500">Available: {selectedProduct.remaining_quantity || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={handleDecreaseQuantity}
                      className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={handleQuantityChange}
                      max={selectedProduct.remaining_quantity || 1}
                      min="1"
                      className="w-20 text-center border rounded py-1 focus:outline-none focus:border-orange-500"
                    />
                    <button 
                      type="button"
                      onClick={handleIncreaseQuantity}
                      className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity >= (selectedProduct.remaining_quantity || 0)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setStartDate(newStartDate);
                      if (endDate && newStartDate >= endDate) {
                        setEndDate('');
                      }
                    }}
                    min={getTomorrowDate()}
                    className="w-full border rounded p-2 focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select a date starting from tomorrow</p>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || getTomorrowDate()}
                    className={`w-full border rounded p-2 focus:outline-none focus:border-orange-500 ${!startDate ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    disabled={!startDate}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {startDate ? `Select a end date` : 'Select start date first'}
                  </p>
                </div>
                
                {startDate && endDate && (
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-lg">₹{calculateTotal()}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {calculateDays()} days × {quantity} item{quantity > 1 ? 's' : ''} × ₹{selectedProduct.pricePerDay || 0}/day
                    </div>
                  </div>
                )}
                
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={!startDate || !endDate || quantity < 1}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    startDate && endDate && quantity >= 1
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {startDate && endDate ? 'Send Rent Request' : 'Select Dates First'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Available Products</h2>
          <p className="text-gray-600 mt-2">Discover tools available for rent</p>
        </div>
    
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const productName = product.name || 'Unnamed Product';
          const categoryName = product.categoryId?.name || 'Uncategorized';
          const sellerName = product.userId?.sellerDetails?.individualName || 
                           product.userId?.sellerDetails?.organizationName || 
                           'Seller';
          const price = product.pricePerDay || 0;
          const stock = product.remaining_quantity || 0;
          const totalStock = product.quantity || 0;
          const description = product.description || 'No description available';

          return (
            <div key={product._id || Math.random()} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-56 bg-white flex items-center justify-center overflow-hidden border-b border-gray-100">
                {product.image ? (
                  <img 
                    src={`http://localhost:4000${product.image}`} 
                    alt={productName}
                    className="max-h-full max-w-full object-contain p-4"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-300" />
                )}
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full font-bold text-gray-900 text-sm">Currently Unavailable</span>
                  </div>
                )}
                <button 
                  type="button"
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-orange-50 transition-all z-10"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                </button>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{productName}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {categoryName}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-orange-600">₹{price}</div>
                    <div className="text-xs text-gray-500">per day</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
              
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Stock: {stock}/{totalStock}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {description}
                </p>

                <button
                  type="button"
                  onClick={() => handleRentClick(product)}
                  disabled={!product.isAvailable}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-auto ${
                    product.isAvailable
                      ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.isAvailable ? 'Rent Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;