import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Home, Calendar, 
  ArrowLeft, Save, Lock, Eye, EyeOff, Building2,
  X, AlertCircle, CheckCircle
} from 'lucide-react';

const EditBuyer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
    const userId = (() => {
    try {
      const id = localStorage.getItem('userId');
      return id ? JSON.parse(id) : null;
    } catch (e) {
      console.error('Error parsing userId:', e);
      return null;
    }
  })();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
    title: ''
  });

  const [formData, setFormData] = useState({
    buyerDetails: {
      buyerName: '',
      dob: ''
    },
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    newPassword: '',
    confirmPassword: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: '',
    confirmPassword: '',
    phone: '',
    pincode: ''
  });

  const showToast = (type, title, message) => {
    setToast({
      show: true,
      type,
      title,
      message
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (!token) {
      showToast('error', 'Authentication Required', 'Please login to access this page.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!userId) {
      showToast('error', 'Session Expired', 'User ID not found. Please login again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    fetchBuyerDetails();
  }, [userId, token, navigate]);

  const fetchBuyerDetails = async () => {
    try {
      console.log('Fetching buyer with ID:', userId);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buyer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.status === "SUCCESS") {
        const buyer = data.data;
        const storedEmail = (() => {
          try {
            const email = localStorage.getItem('email');
            return email ? JSON.parse(email) : '';
          } catch {
            return '';
          }
        })();

        setFormData(prev => ({
          ...prev,
          buyerDetails: {
            buyerName: buyer.buyerDetails?.buyerName || '',
            dob: buyer.buyerDetails?.dob || ''
          },
          phone: buyer.phone || '',
          email: buyer.email || storedEmail || '',
          address: {
            street: buyer.address?.street || '',
            city: buyer.address?.city || '',
            state: buyer.address?.state || '',
            pincode: buyer.address?.pincode || ''
          }
        }));
      } else {
        showToast('error', 'Failed to Load', data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showToast('error', 'Connection Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'phone' && value) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        error = 'Phone number must be 10 digits';
      }
    }
    
    if (name === 'address.pincode' || name === 'pincode') {
      const pincodeRegex = /^\d{6}$/;
      if (value && !pincodeRegex.test(value)) {
        error = 'Pincode must be 6 digits';
      }
    }
    
    if (name === 'newPassword' && value) {
      if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
    }
    
    if (name === 'confirmPassword' && value) {
      if (value !== formData.newPassword) {
        error = 'Passwords do not match';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'address.street' && value.length > 500) {
      showToast('warning', 'Character Limit', 'Street address cannot exceed 500 characters');
      return;
    }
    
    if (name === 'address.city' && value.length > 100) {
      showToast('warning', 'Character Limit', 'City name cannot exceed 100 characters');
      return;
    }
    
    if (name === 'address.state' && value.length > 100) {
      showToast('warning', 'Character Limit', 'State name cannot exceed 100 characters');
      return;
    }
    
    if (name === 'address.pincode' && value.length > 6) {
      return; 
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
        
        if (child === 'pincode') {
          const error = validateField(name, value);
          setFieldErrors(prev => ({ ...prev, pincode: error }));
        }
      } else if (parent === 'buyerDetails') {
        setFormData(prev => ({
          ...prev,
          buyerDetails: {
            ...prev.buyerDetails,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
      
      if (name === 'newPassword') {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setToast({ show: false, type: '', message: '', title: '' });

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('error', 'Password Error', 'Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        showToast('error', 'Password Error', 'Password must be at least 6 characters long');
        return;
      }
    }

    if (formData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        showToast('error', 'Validation Error', 'Phone number must be 10 digits');
        return;
      }
    }

    if (formData.address.pincode) {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(formData.address.pincode)) {
        showToast('error', 'Validation Error', 'Pincode must be 6 digits');
        return;
      }
    }

    setUpdating(true);
    const updateData = {
      phone: formData.phone,
      address: formData.address,
      buyerDetails: formData.buyerDetails
    };

    if (formData.newPassword) {
      updateData.password = formData.newPassword;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buyerUpdate/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        showToast('success', 'Success!', 'Profile updated successfully!');
        
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
        
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        showToast('error', 'Update Failed', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('error', 'Connection Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-orange-600 text-xl font-bold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification Popup */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className={`
            flex items-start gap-3 p-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-md
            ${toast.type === 'success' ? 'bg-green-50 border-green-200' : ''}
            ${toast.type === 'error' ? 'bg-red-50 border-red-200' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
          `}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${toast.type === 'success' ? 'bg-green-500' : ''}
              ${toast.type === 'error' ? 'bg-red-500' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-500' : ''}
              ${toast.type === 'info' ? 'bg-blue-500' : ''}
            `}>
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-white" />}
              {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-white" />}
            </div>
            
            <div className="flex-1">
              <h3 className={`
                font-bold text-base mb-1
                ${toast.type === 'success' ? 'text-green-800' : ''}
                ${toast.type === 'error' ? 'text-red-800' : ''}
                ${toast.type === 'warning' ? 'text-yellow-800' : ''}
                ${toast.type === 'info' ? 'text-blue-800' : ''}
              `}>
                {toast.title}
              </h3>
              <p className={`
                text-sm
                ${toast.type === 'success' ? 'text-green-700' : ''}
                ${toast.type === 'error' ? 'text-red-700' : ''}
                ${toast.type === 'warning' ? 'text-yellow-700' : ''}
                ${toast.type === 'info' ? 'text-blue-700' : ''}
              `}>
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={closeToast}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Edit Profile</h1>
                <p className="text-orange-100">Update your personal information and settings</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="buyerDetails.buyerName"
                    value={formData.buyerDetails.buyerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="buyerDetails.dob"
                    value={formData.buyerDetails.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    maxLength="10"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300 ${
                      fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Address Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Home className="w-4 h-4 text-orange-600" />
                      Street Address
                    </label>
                    <span className={`text-xs ${
                      formData.address.street.length > 450 
                        ? 'text-orange-600 font-semibold' 
                        : 'text-gray-500'
                    }`}>
                      {formData.address.street.length}/500
                    </span>
                  </div>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    maxLength="500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">City</label>
                      <span className="text-xs text-gray-500">
                        {formData.address.city.length}/100
                      </span>
                    </div>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      maxLength="100"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">State</label>
                      <span className="text-xs text-gray-500">
                        {formData.address.state.length}/100
                      </span>
                    </div>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      maxLength="100"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Pincode</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      placeholder="6 digit pincode"
                      maxLength="6"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300 ${
                        fieldErrors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {fieldErrors.pincode && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                Leave blank if you don't want to change your password
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      minLength="6"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300 pr-12 ${
                        fieldErrors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300 pr-12 ${
                        fieldErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-orange-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Need help changing your email?</h3>
              <p className="text-sm text-gray-600">
                For security reasons, email cannot be changed from this page. 
                Please contact our support team at{' '}
                <a href="mailto:support@rentx.com" className="text-orange-600 font-semibold hover:underline">
                  support@rentx.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditBuyer;