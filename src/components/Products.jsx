import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Star, Heart, MapPin, Package, Filter,
  ChevronRight, Truck
} from 'lucide-react';
import axios from 'axios';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/seller/allProducts`, 
        {},
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data.status === 'SUCCESS') {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Available Products</h2>
          <p className="text-gray-600 mt-2">Discover tools available for rent</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-orange-600 transition-all">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-56 bg-white flex items-center justify-center overflow-hidden border-b border-gray-100">
              {product.image ? (
                <img 
                  src={`http://localhost:4000${product.image}`} 
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMzIgMzZDMzUuMzEzNyAzNiAzOCAzMy4zMTM3IDM4IDMwQzM4IDI2LjY4NjMgMzUuMzEzNyAyNCAzMiAyNEMyOC42ODYzIDI0IDI2IDI2LjY4NjMgMjYgMzBDMjYgMzMuMzEzNyAyOC42ODYzIDM2IDMyIDM2WiIgZmlsbD0iIzk5OSIvPjxwYXRoIGQ9Ik00MiAzNkM0NCA0NCAzMiA1MCAzMiA1MEMzMiA1MCAyMCA0NCAyMiAzNkMyNCAyOCAzMiAyNCAzMiAyNEMzMiAyNCA0MCAyOCA0MiAzNloiIGZpbGw9IiM5OTkiLz48L3N2Zz4=';
                  }}
                />
              ) : (
                <Package className="w-16 h-16 text-gray-300" />
              )}
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                  <span className="bg-white px-4 py-2 rounded-full font-bold text-gray-900 text-sm">Currently Unavailable</span>
                </div>
              )}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-orange-50 transition-all z-10">
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {product.categoryId?.name || 'Uncategorized'}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {product.userId?.sellerDetails?.individualName || product.userId?.sellerDetails?.organizationName || 'Seller'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-orange-600">₹{product.pricePerDay}</div>
                  <div className="text-xs text-gray-500">per day</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">4.5</span>
                  <span className="text-gray-500">(15)</span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.isAvailable ? 'Available' : 'Unavailable'}
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Stock: {product.remaining_quantity || 0}/{product.quantity}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {product.description || 'No description available'}
              </p>

              <button
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
        ))}
      </div>

    </div>
  );
};

export default Products;