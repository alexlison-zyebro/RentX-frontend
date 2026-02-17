import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle, Layers, MoreVertical, Edit3Icon, Edit } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modal, setModal] = useState({ type: '', show: false, data: null });
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const API = `${import.meta.env.VITE_API_URL}/api/admin/categories`;
  const API2 = `${import.meta.env.VITE_API_URL}/api/categories`;


  const showMessage = (type, msg) => {
    if (type === 'success') setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API2}/all`, {}, {
        headers: { 'Content-Type': 'application/json', 'token': token }
      });
      if (data.status === 'SUCCESS') setCategories(data.data || []);
      else setError(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return setError('Category name is required');
    
    try {
      setSubmitting(true);
      const isEdit = modal.type === 'edit';
      const url = isEdit ? `${API}/update/${modal.data._id}` : `${API}/add`;
      const method = isEdit ? 'put' : 'post';
      
      const { data } = await axios[method](url, { name: formName.trim() }, {
        headers: { 'Content-Type': 'application/json', 'token': token }
      });

      if (data.status === 'SUCCESS') {
        showMessage('success', data.message);
        closeModal();
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.post(`${API}/delete/${modal.data._id}`, {}, {
        headers: { 'Content-Type': 'application/json', 'token': token }
      });

      if (data.status === 'SUCCESS') {
        showMessage('success', 'Category deleted successfully');
        closeModal();
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (category) => {
    try {
      const { data } = await axios.post(`${API}/toggle-status/${category._id}`, {}, {
        headers: { 'Content-Type': 'application/json', 'token': token }
      });

      if (data.status === 'SUCCESS') {
        showMessage('success', data.message);
        setDropdownOpen(null);
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Toggle failed');
    }
  };

  const openModal = (type, data = null) => {
    setModal({ type, show: true, data });
    setFormName(data?.name || '');
    setError('');
    setDropdownOpen(null);
  };

  const closeModal = () => {
    setModal({ type: '', show: false, data: null });
    setFormName('');
  };

  useEffect(() => { fetchCategories(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  const activeCount = categories.filter(c => c.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
              <p className="text-sm text-gray-600">Manage product categories</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchCategories} className="p-2 bg-white border rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">{categories.length - activeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No categories found</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-100">
                    <td className="ps-5 text-left py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className=" ps-2 text-left py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cat.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 ps-4 text-left text-sm text-gray-600">
                      {new Date(cat.createdAt).toLocaleDateString('en-US', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(dropdownOpen === cat._id ? null : cat._id)}
                            className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {dropdownOpen === cat._id && (
                            <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button
                                onClick={() => handleToggle(cat)}
                                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-orange-100 ${
                                  cat.isActive ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {cat.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                {cat.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => openModal('edit', cat)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-100"
                              >
                                <Edit className="w-4 h-4 text-green-600" />
                                Edit
                              </button>
                              <button
                                onClick={() => openModal('delete', cat)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-orange-100 rounded-b-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                <div className="flex items-center justify-between text-white">
                  <h3 className="text-xl font-bold">
                    {modal.type === 'add' && 'Add Category'}
                    {modal.type === 'edit' && 'Edit Category'}
                    {modal.type === 'delete' && 'Delete Category'}
                  </h3>
                  <button onClick={closeModal} className="p-1.5 hover:bg-white/20 rounded-full">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {modal.type === 'delete' ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Are you sure?</p>
                      <p className="text-sm text-gray-700">
                        Delete category <span className="font-semibold">"{modal.data?.name}"</span>? This cannot be undone.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={submitting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                      >
                        {submitting ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={closeModal}
                        disabled={submitting}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter category name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                      >
                        {submitting ? (modal.type === 'edit' ? 'Updating...' : 'Adding...') : (modal.type === 'edit' ? 'Update' : 'Add')}
                      </button>
                      <button
                        onClick={closeModal}
                        disabled={submitting}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;