import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  MapPin
} from 'lucide-react';
import axios from 'axios';

const MyRentals = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const BASE_URL = 'http://localhost:4000/api';

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchRentRequests();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchRentRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/my-requests`,
        {},
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setRentRequests(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching rent requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeRentals = rentRequests.filter(request => 
    request.status !== 'COMPLETED'
  );

  const rentalHistory = rentRequests.filter(request => 
    request.status === 'COMPLETED'
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'Pending'
        };
      case 'ACCEPTED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Accepted'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Rejected'
        };
      case 'COLLECTED':
        return {
          icon: <Truck className="w-4 h-4" />,
          color: 'text-purple-700',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          label: 'Collected'
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Completed'
        };
      default:
        return {
          icon: <Package className="w-4 h-4" />,
          color: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown'
        };
    }
  };

  const displayData = activeTab === 'active' ? activeRentals : rentalHistory;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-3 mb-8">
            <div className="h-11 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-11 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Rentals</h1>
          <p className="text-gray-600 text-lg">Track and manage all your rental orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'active'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span>Active</span>
            <span className={`min-w-[24px] h-6 px-2 rounded-full text-sm font-bold flex items-center justify-center ${
              activeTab === 'active' 
                ? 'bg-white/20 text-white' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {activeRentals.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>History</span>
            <span className={`min-w-[24px] h-6 px-2 rounded-full text-sm font-bold flex items-center justify-center ${
              activeTab === 'history' 
                ? 'bg-white/20 text-white' 
                : 'bg-green-100 text-green-700'
            }`}>
              {rentalHistory.length}
            </span>
          </button>
        </div>

        {/* Content */}
        {displayData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className={`w-20 h-20 rounded-2xl ${
              activeTab === 'active' ? 'bg-orange-100' : 'bg-green-100'
            } flex items-center justify-center mx-auto mb-5`}>
              {activeTab === 'active' ? (
                <Truck className="w-10 h-10 text-orange-600" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'active' ? 'No Active Rentals' : 'No Rental History'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {activeTab === 'active' 
                ? 'You don\'t have any ongoing or pending rentals at the moment'
                : 'You haven\'t completed any rentals yet. Start renting to build your history!'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const productName = request.productId?.name || 'Product';
              const productImage = request.productId?.image;
              
              return (
                <div 
                  key={request._id} 
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {productImage ? (
                        <img 
                          src={`http://localhost:4000${productImage}`}
                          alt={productName}
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNDggNTRDNTMuNTIyOCA1NCA1OCA0OS41MjI4IDU4IDQ0QzU4IDM4LjQ3NzIgNTMuNTIyOCAzNCA0OCAzNEM0Mi40NzcyIDM0IDM4IDM4LjQ3NzIgMzggNDRDMzggNDkuNTIyOCA0Mi40NzcyIDU0IDQ4IDU0WiIgZmlsbD0iIzlDQTNCMCIvPjxwYXRoIGQ9Ik02MyA1NEM2NiA2NiA0OCA3NSA0OCA3NUM0OCA3NSAzMCA2NiAzMyA1NEMzNiA0MiA0OCAzNiA0OCAzNkM0OCAzNiA2MCA0MiA2MyA1NFoiIGZpbGw9IiM5Q0EzQjAiLz48L3N2Zz4=';
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {productName}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${statusConfig.bgColor} ${statusConfig.borderColor} whitespace-nowrap`}>
                          <span className={statusConfig.color}>
                            {statusConfig.icon}
                          </span>
                          <span className={`text-sm font-semibold ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-medium">Quantity</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {request.quantity}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Duration</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">Total</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{request.totalAmount}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              {request.completedAt ? 'Completed' : 'Requested'}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(request.completedAt || request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {request.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-900 mb-1">
                                Rejection Reason
                              </p>
                              <p className="text-sm text-red-700">
                                {request.rejectionReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;