import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, Truck, Package,
  Calendar, DollarSign, User, AlertCircle, ChevronDown,
  ThumbsUp, ThumbsDown, Archive, CheckSquare, RefreshCw,
  X, MapPin,
  Phone
} from 'lucide-react';
import axios from 'axios';

const RentalActions = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchRentRequests();
    } else {
      setLoading(false);
      setError('Please login to view rental requests');
    }
  }, [token]);

  const fetchRentRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `${BASE_URL}/seller/requests`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setRentRequests(response.data.data || []);
      } else {
        setError('Failed to fetch rental requests');
      }
    } catch (err) {
      console.error('Error fetching rent requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch rental requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200',
          dotColor: 'bg-amber-500',
          label: 'Pending'
        };
      case 'ACCEPTED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-500',
          label: 'Accepted'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200',
          dotColor: 'bg-red-500',
          label: 'Rejected'
        };
      case 'COLLECTED':
        return {
          icon: <Truck className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200',
          dotColor: 'bg-purple-500',
          label: 'Collected'
        };
      case 'COMPLETED':
        return {
          icon: <Package className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200',
          dotColor: 'bg-emerald-500',
          label: 'Completed'
        };
      default:
        return {
          icon: <Package className="w-4 h-4" />,
          color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200',
          dotColor: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      console.log("error->",error);
      return '';
    }
  };

  const getRequestId = (id) => {
    if (!id) return '';
    return id.slice(-6).toUpperCase();
  };

  // Add these helper functions
  const canMarkAsCollected = (startDate) => {
    if (!startDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    return today >= start;
  };

  const canMarkAsCompleted = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    return today >= end;
  };

  const openRejectModal = (requestId) => {
    setSelectedRequest(requestId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    
    await handleApproveReject(selectedRequest, 'REJECTED', rejectionReason);
    handleRejectCancel();
  };

  const handleApproveReject = async (requestId, action, providedReason = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      
      let finalRejectionReason = providedReason;
      
      if (action === 'REJECTED' && !finalRejectionReason) {
        openRejectModal(requestId);
        setActionLoading(prev => ({ ...prev, [requestId]: false }));
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/seller/approve-reject/${requestId}`,
        {
          action,
          ...(action === 'REJECTED' && { rejectionReason: finalRejectionReason })
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        alert(`Request ${action.toLowerCase()} successfully`);
        fetchRentRequests();
      } else {
        alert(response.data?.message || `Failed to ${action.toLowerCase()} request`);
      }
    } catch (err) {
      console.error('Error updating request:', err);
      alert(err.response?.data?.message || `Failed to ${action.toLowerCase()} request`);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      
      const response = await axios.put(
        `${BASE_URL}/seller/update-status/${requestId}`,
        { status },
        {
          headers: { 
            'Content-Type': 'application/json',
            'token': token 
          }
        }
      );

      if (response.data && response.data.status === 'SUCCESS') {
        alert(`Status updated to ${status.toLowerCase()} successfully`);
        fetchRentRequests();
      } else {
        alert(response.data?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const toggleExpand = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const pendingRequests = rentRequests.filter(req => req.status === 'PENDING');
  const activeRequests = rentRequests.filter(req => 
    req.status === 'ACCEPTED' || req.status === 'COLLECTED'
  );
  const completedRequests = rentRequests.filter(req => 
    req.status === 'COMPLETED' || req.status === 'REJECTED'
  );

  const renderRequestItem = (request) => {
    const isExpanded = expandedRequest === request._id;
    const isLoading = actionLoading[request._id];
    const statusConfig = getStatusConfig(request.status);
    const requestId = getRequestId(request._id);

    // Check if dates are valid for actions
    const canCollect = canMarkAsCollected(request.startDate);
    const canComplete = canMarkAsCompleted(request.endDate);

    return (
      <div 
        key={request._id} 
        className="group bg-white border border-gray-200/80 rounded-2xl p-5 mb-4 hover:shadow-lg hover:border-gray-300/80 transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {request.productId?.image ? (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={`${import.meta.env.VITE_API_URL}${request.productId.image}`}
                  alt={request.productId.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMzIgMzZDMzUuMzEzNyAzNiAzOCAzMy4zMTM3IDM4IDMwQzM4IDI2LjY4NjMgMzUuMzEzNyAyNCAzMiAyNEMyOC42ODYzIDI0IDI2IDI2LjY4NjMgMjYgMzBDMjYgMzMuMzEzNyAyOC42ODYzIDM2IDMyIDM2WiIgZmlsbD0iIzk5OSIvPjxwYXRoIGQ9Ik00MiAzNkM0NCA0NCAzMiA1MCAzMiA1MEMzMiA1MCAyMCA0NCAyMiAzNkMyNCAyOCAzMiAyNCAzMiAyNEMzMiAyNCA0MCAyOCA0MiAzNloiIGZpbGw9IiM5OTkiLz48L3N2Zz4=';
                  }}
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-100 flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-base mb-2 truncate">
                {request.productId?.name || 'Product'}
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${statusConfig.color} shadow-sm`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`}></span>
                  {statusConfig.label}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-gray-600 bg-gray-50 border border-gray-200">
                  #{requestId}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleExpand(request._id)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors ml-2 flex-shrink-0"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-xs font-medium text-blue-700">Quantity</p>
            </div>
            <p className="font-bold text-lg text-blue-900">{request.quantity}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-100/50">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">Amount</p>
            </div>
            <p className="font-bold text-lg text-emerald-900">₹{request.totalAmount}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <p className="text-xs font-medium text-purple-700">From Date</p>
            </div>
            <p className="font-bold text-base text-purple-900">{formatDate(request.startDate)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <p className="text-xs font-medium text-orange-700">To Date</p>
            </div>
            <p className="font-bold text-base text-orange-900">{formatDate(request.endDate)}</p>
          </div>
        </div>

        {/* Expanded Details */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-100 pt-4 mt-1">
            {/* Customer Info */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Customer Details</span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {request.buyerId?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {request.buyerId?.email || 'N/A'}
                    </p>
                    {request.buyerId?.phone && (
                      <p className="text-xs mb-3 mt-3 text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-4 text-gray-500" /> {request.buyerId.phone}
                      </p>
                    )}
                    
                    {request.buyerId?.address && (
                      <div className="mt-3 pt-3 border p-3 rounded-md  border-orange-300/50">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">Customer Address</span>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2.5 border border-gray-200/70">
                          <div className="space-y-1.5">
                            {request.buyerId.address.street && (
                              <p className="text-xs font-medium text-gray-800">Street Name: {request.buyerId.address.street}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              {request.buyerId.address.city && (
                                <span className="text-xs text-gray-600 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100">
                                  City :  {request.buyerId.address.city}
                                </span>
                              )}
                              
                              {request.buyerId.address.state && (
                                <span className="text-xs text-gray-600 px-1.5 py-0.5 bg-purple-50 rounded border border-purple-100">
                                 State :  {request.buyerId.address.state}
                                </span>
                              )}
                              {request.buyerId.address.pincode && (
                                <span className="text-xs text-gray-600 px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-100 font-mono">
                                  Pincode : {request.buyerId.address.pincode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {request.status === 'PENDING' && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveReject(request._id, 'ACCEPTED')}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => openRejectModal(request._id)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}

              {request.status === 'ACCEPTED' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(request._id, 'COLLECTED')}
                    disabled={isLoading || !canCollect}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
                      canCollect
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    title={!canCollect ? "Cannot mark as collected before the start date" : "Mark as collected"}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    {canCollect ? 'Mark as Collected' : 'Not yet available for collection'}
                  </button>
                </div>
              )}

              {request.status === 'COLLECTED' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(request._id, 'COMPLETED')}
                    disabled={isLoading || !canComplete}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
                      canComplete
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    title={!canComplete ? "Cannot mark as completed before the end date" : "Mark as completed"}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {canComplete ? 'Mark as Completed' : 'Not yet available for completion'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Rental Requests</h3>
            <p className="text-sm text-gray-500 mt-1">Loading requests...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded-lg w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                <div className="h-16 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-5">Rental Requests</h3>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200/50 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Error Loading Requests</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchRentRequests}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Rental Requests</h3>
          <p className="text-sm text-gray-500">Manage customer rental requests</p>
        </div>
        <button
          type="button"
          onClick={fetchRentRequests}
          className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors shadow-sm hover:shadow-md"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {rentRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">No Rental Requests Yet</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Rental requests will appear here once customers rent your tools
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingRequests.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">Pending Requests</h4>
                  <p className="text-xs text-gray-500">{pendingRequests.length} waiting for approval</p>
                </div>
              </div>
              <div>
                {pendingRequests.map(renderRequestItem)}
              </div>
            </div>
          )}

          {activeRequests.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">Active Rentals</h4>
                  <p className="text-xs text-gray-500">{activeRequests.length} ongoing rentals</p>
                </div>
              </div>
              <div>
                {activeRequests.map(renderRequestItem)}
              </div>
            </div>
          )}

          {completedRequests.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">Completed Rentals</h4>
                  <p className="text-xs text-gray-500">{completedRequests.length} total completed</p>
                </div>
              </div>
              <div>
                {completedRequests.map(renderRequestItem)}
              </div>
            </div>
          )}
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Reject Request</h3>
                    <p className="text-xs text-red-100 mt-0.5">Please provide a reason</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRejectCancel}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejecting this rental request..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none text-sm text-gray-700 placeholder-gray-400"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                This reason will be shared with the customer
              </p>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                type="button"
                onClick={handleRejectCancel}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalActions;