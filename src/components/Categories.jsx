import React, { useState, useEffect } from 'react';
import { 
  Package, Wrench, Drill, Paintbrush, Hammer, 
  Battery, CheckCircle, ChevronRight, Layers,
  Square, Box // Using Box instead of Tool
} from 'lucide-react';
import axios from 'axios';

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = `${import.meta.env.VITE_API_URL}`;

  const categoryIcons = {
    'Tools': <Wrench className="w-6 h-6" />,
    'Electronics': <Battery className="w-6 h-6" />,
    'Home & Garden': <Paintbrush className="w-6 h-6" />,
    'Furniture': <Box className="w-6 h-6" />, 
    'Sporting Goods': <Hammer className="w-6 h-6" />,
    'Construction': <Drill className="w-6 h-6" />,
    'default': <Package className="w-6 h-6" />
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/categories/all`, 
        {},
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data.status === 'SUCCESS') {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || categoryIcons.default;
  };

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
        <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100">
          <Package className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Available</h3>
          <p className="text-gray-500">Categories will appear here once added by admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
        <div className="text-sm text-gray-600">
          {categories.length} categories available
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat._id} 
            className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:scale-[1.02]"
          >
            {cat.isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
              {getCategoryIcon(cat.name)}
            </div>
            
            <h3 className="font-bold text-gray-900 text-center mb-1 truncate text-sm">{cat.name}</h3>
            
            <div className="flex items-center justify-center gap-1 text-xs">
              <span className={`px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Categories;