import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    quantity: '',
    pricePerDay: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/seller/my-products`, {}, {
        headers: { 
          'Content-Type': 'application/json',
          'token': token 
        }
      });
      
      if (response.data.status === 'SUCCESS') {
        setProducts(response.data.data || []);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
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
      } else {
        console.log('Categories API error:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        image: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = async (type, product = null) => {
    try {
      await fetchCategories();
      
      if (type === 'edit' && product) {
        setFormData({
          name: product.name || '',
          categoryId: product.categoryId?._id || product.categoryId || '',
          description: product.description || '',
          quantity: product.quantity ? product.quantity.toString() : '1',
          pricePerDay: product.pricePerDay ? product.pricePerDay.toString() : '0',
          image: null
        });
        setImagePreview(product.image ? `${import.meta.env.VITE_API_URL}${product.image}` : '');
      } else {
        setFormData({
          name: '',
          categoryId: '',
          description: '',
          quantity: '1',
          pricePerDay: '0',
          image: null
        });
        setImagePreview('');
      }
      
      setModal({
        show: true,
        type: type,
        data: product
      });
      setError('');
    } catch (err) {
      console.error('Error opening modal:', err);
      setError('Failed to load data');
    }
  };

  const closeModal = () => {
    setModal({ show: false, type: '', data: null });
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      quantity: '',
      pricePerDay: '',
      image: null
    });
    setImagePreview('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }
    
    if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    
    if (modal.type === 'add' && !formData.image) {
      setError('Product image is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('categoryId', formData.categoryId);
      data.append('description', formData.description);
      data.append('quantity', formData.quantity);
      data.append('pricePerDay', formData.pricePerDay);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      let response;

      if (modal.type === 'edit' && modal.data) {
        response = await axios.put(
          `${BASE_URL}/seller/updateProduct/${modal.data._id}`,
          data,
          {
            headers: {
              'token': token
            }
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/seller/add-product`,
          data,
          {
            headers: {
              'token': token
            }
          }
        );
      }

      console.log('API Response:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        setSuccess(response.data.message || 'Product saved successfully');
        closeModal();
        fetchProducts();
      } else {
        setError(response.data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data) {
        setError(err.response.data);
      } else if (err.request) {
        setError('No response from server. Check if backend is running.');
      } else {
        setError('Request failed: ' + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (productId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/seller/toggle-availability/${productId}`,
        {},
        { 
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          } 
        }
      );
      
      if (response.data.status === 'SUCCESS') {
        setSuccess(response.data.message || 'Product updated');
        fetchProducts();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      setError('Failed to update product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-3">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-gray-600">Manage your rental products</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 disabled:bg-gray-400"
          disabled={submitting}
        >
          <span>+</span> Add Product
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border text-center">
          <p className="text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <p className="text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.isAvailable).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <p className="text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => !p.isAvailable).length}
          </p>
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">No products found</p>
          <button 
            onClick={() => openModal('add')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
            disabled={submitting}
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${product.image}`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGRkZGRkYiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0iI0U1RTVFNSIvPjxjaXJjbGUgY3g9IjMyIiBjeT0iMjQiIHI9IjgiIGZpbGw9IiM5OTk5OTkiLz48cGF0aCBkPSJNMzIgNDBDMzYgNDQgMzIgNTAgMzIgNTBDMzIgNTAgMjggNDQgMzIgNDBaIiBmaWxsPSIjOTk5OTk5Ii8+PC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-2xl">📦</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {product.categoryId?.name || 'No Category'}
                    </p>
                    <div className="flex gap-4 mt-2 flex-wrap">
                      <span className="text-green-600 font-medium">
                        ₹{product.pricePerDay}/day
                      </span>
                      <span className="text-gray-600">
                        Stock: {product.remaining_quantity || 0}/{product.quantity}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(product._id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      product.isAvailable 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    disabled={submitting}
                  >
                    {product.isAvailable ? 'Make Unavailable' : 'Make Available'}
                  </button>
                  <button
                    onClick={() => openModal('edit', product)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                    disabled={submitting}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="bg-white rounded-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-orange-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {modal.type === 'edit' ? 'Edit Product' : 'Add Product'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-xl disabled:opacity-50"
                  disabled={submitting}
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter product name"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Category *</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={submitting || categories.length === 0}
                    >
                      <option value="">
                        {categories.length === 0 ? 'Loading categories...' : 'Select Category'}
                      </option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {categories.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {categories.length} categories available
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Product Image {modal.type === 'add' && '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={submitting}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Price/Day (₹) *</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter description (optional)"
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Saving...
                        </span>
                      ) : modal.type === 'edit' ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={submitting}
                      className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;