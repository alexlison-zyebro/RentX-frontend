import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Building,
  AlertCircle,
  Eye,
  X,
  MapPin,
  FileText,
  Copy,
  Fingerprint,
  Home,
  Globe,
  Navigation,
  CreditCard,
  Briefcase,
  Hash
} from "lucide-react";

const AdminRequest = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchPendingSellers = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await axios.post(
        "http://localhost:4000/api/admin/sellers/pending",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          }
        }
      );

      if (response.data.status === "SUCCESS") {
        setPendingSellers(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Fetch pending sellers error:", error);
      
      if (error.response?.data?.status === "InvalidToken") {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        setError("Failed to load pending requests");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewRequest = async (sellerId) => {
    try {
      setActionError("");
      setActionSuccess("");
      
      const response = await axios.post(
        "http://localhost:4000/api/admin/sellers/details",
        { sellerId },
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          }
        }
      );

      if (response.data.status === "SUCCESS") {
        setSelectedSeller(response.data.data);
        setShowPopup(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Fetch seller details error:", error);
      setError("Failed to load seller details");
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      setApproving(true);
      setActionError("");
      setActionSuccess("");

      const response = await axios.post(
        "http://localhost:4000/api/admin/sellers/approve",
        { sellerId },
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          }
        }
      );

      if (response.data.status === "SUCCESS") {
        setActionSuccess("Seller approved successfully!");
        setTimeout(() => {
          fetchPendingSellers();
          closePopup();
        }, 1500);
      } else {
        setActionError(response.data.message);
      }
    } catch (error) {
      console.error("Approve seller error:", error);
      setActionError(error.response?.data?.message || "Failed to approve seller");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (sellerId) => {
    if (!rejectionReason.trim()) {
      setActionError("Please provide a rejection reason");
      return;
    }

    try {
      setRejecting(true);
      setActionError("");
      setActionSuccess("");

      const response = await axios.post(
        "http://localhost:4000/api/admin/sellers/reject",
        { 
          sellerId, 
          rejectionReason: rejectionReason.trim() 
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          }
        }
      );

      if (response.data.status === "SUCCESS") {
        setActionSuccess("Seller rejected successfully!");
        setTimeout(() => {
          fetchPendingSellers();
          closePopup();
        }, 1500);
      } else {
        setActionError(response.data.message);
      }
    } catch (error) {
      console.error("Reject seller error:", error);
      setActionError(error.response?.data?.message || "Failed to reject seller");
    } finally {
      setRejecting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedSeller(null);
    setRejectionReason("");
    setActionError("");
    setActionSuccess("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getSellerTypeIcon = (sellerType) => {
    return sellerType === "INDIVIDUAL" ? <User className="w-3 h-3" /> : <Building className="w-3 h-3" />;
  };

  const getSellerTypeColor = (sellerType) => {
    return sellerType === "INDIVIDUAL" 
      ? "bg-purple-100 text-purple-800 border-purple-200" 
      : "bg-amber-100 text-amber-800 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 w-5 h-5" />
          </div>
          <p className="mt-3 text-gray-600 text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Sellers Requests</h1>
            <p className="text-orange-100 text-sm">Review pending seller applications</p>
          </div>
          <button 
            onClick={fetchPendingSellers}
            disabled={refreshing}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-lg text-sm"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{pendingSellers.length}</div>
            <div className="text-xs text-orange-100">Total Requests</div>
          </div>
          <div className="h-6 w-px bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold">{pendingSellers.length}</div>
            <div className="text-xs text-orange-100">Pending</div>
          </div>
          <div className="h-6 w-px bg-white/30"></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {pendingSellers.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No Pending Requests</h3>
          <p className="text-gray-500 text-sm mb-3">All applications reviewed</p>
          <button 
            onClick={fetchPendingSellers}
            className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
          >
            <RefreshCw className="w-3 h-3" />
            Check Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingSellers.map((seller, index) => (
            <div 
              key={seller._id} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(seller.sellerDetails?.individualName || seller.buyerDetails?.buyerName || "S")[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {seller.sellerDetails?.individualName || 
                         seller.sellerDetails?.organizationName || 
                         seller.buyerDetails?.buyerName || 
                         "Unnamed Seller"}
                      </h3>
                      {seller.sellerDetails?.sellerType && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getSellerTypeColor(seller.sellerDetails.sellerType)}`}>
                          {getSellerTypeIcon(seller.sellerDetails.sellerType)}
                          {seller.sellerDetails.sellerType}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[180px]">{seller.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{seller.phone || "No phone"}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{formatDate(seller.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewRequest(seller._id)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm ml-3"
                >
                  <Eye className="w-3 h-3" />
                  View Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <p className="text-xs text-gray-500 text-center">
          Review carefully. Approved sellers get email notifications.
        </p>
      </div>

      {showPopup && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {(selectedSeller.sellerDetails?.individualName || selectedSeller.buyerDetails?.buyerName || "S")[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Seller Application Details</h2>
                    <p className="text-orange-100 text-sm flex items-center gap-1">
                      <span>ID:</span>
                      <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                        {selectedSeller._id?.substring(0, 12)}...
                      </span>
                      <button 
                        onClick={() => copyToClipboard(selectedSeller._id)}
                        className="p-0.5 hover:bg-white/20 rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closePopup}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Popup Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {actionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{actionError}</p>
                </div>
              )}
              
              {actionSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{actionSuccess}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Seller Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {selectedSeller.sellerDetails?.sellerType === "ORGANIZATION" ? "Organization Name" : "Full Name"}
                      </label>
                      <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded mt-1">
                        {selectedSeller.sellerDetails?.individualName || 
                         selectedSeller.sellerDetails?.organizationName || 
                         selectedSeller.buyerDetails?.buyerName || 
                         "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Seller Type
                      </label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSellerTypeColor(selectedSeller.sellerDetails?.sellerType)}`}>
                          {getSellerTypeIcon(selectedSeller.sellerDetails?.sellerType)}
                          {selectedSeller.sellerDetails?.sellerType || "N/A"}
                        </span>
                      </div>
                    </div>

                    {selectedSeller.sellerDetails?.individualName && selectedSeller.sellerDetails?.sellerType === "ORGANIZATION" && (
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Contact Person</label>
                        <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded mt-1">
                          {selectedSeller.sellerDetails.individualName}
                        </div>
                      </div>
                    )}

                    {selectedSeller.sellerDetails?.individualDob && (
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Date of Birth</label>
                        <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded mt-1">
                          {selectedSeller.sellerDetails.individualDob}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Application Date
                      </label>
                      <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded mt-1">
                        {formatDate(selectedSeller.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Email Address</label>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded flex-1 truncate">
                          {selectedSeller.email}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(selectedSeller.email)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Phone Number</label>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="font-medium text-gray-900 text-sm p-2 bg-gray-50 rounded flex-1">
                          {selectedSeller.phone || "Not provided"}
                        </div>
                        {selectedSeller.phone && (
                          <button 
                            onClick={() => copyToClipboard(selectedSeller.phone)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSeller.sellerDetails?.aadhaarNumber && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100 to-transparent opacity-30 rounded-full translate-y-8 -translate-x-8"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                          <Fingerprint className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Aadhaar Verification</h3>
                      </div>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        VERIFICATION REQUIRED
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500 font-medium">Aadhaar Number</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="font-bold text-lg tracking-wider text-gray-900 font-mono bg-white p-3 rounded-lg border border-blue-300 flex-1">
                            {selectedSeller.sellerDetails.aadhaarNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(selectedSeller.sellerDetails.aadhaarNumber)}
                            className="p-2 hover:bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-blue-300 rounded-lg p-3">
                        <label className="text-xs text-gray-500 font-medium">Verification Status</label>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Pending Verification
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          Verify this Aadhaar number with official records
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSeller.address && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Address Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedSeller.address.street && (
                      <div className="lg:col-span-2">
                        <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          Street Address
                        </label>
                        <div className="font-medium text-gray-900 text-sm p-3 bg-gray-50 rounded-lg mt-1 border border-gray-200">
                          {selectedSeller.address.street}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        City
                      </label>
                      <div className="font-medium text-gray-900 text-sm p-3 bg-gray-50 rounded-lg mt-1 border border-gray-200">
                        {selectedSeller.address.city || "N/A"}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        State
                      </label>
                      <div className="font-medium text-gray-900 text-sm p-3 bg-gray-50 rounded-lg mt-1 border border-gray-200">
                        {selectedSeller.address.state || "N/A"}
                      </div>
                    </div>
                    
                    {selectedSeller.address.pincode && (
                      <div>
                        <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Pincode
                        </label>
                        <div className="font-medium text-gray-900 text-sm p-3 bg-gray-50 rounded-lg mt-1 border border-gray-200">
                          {selectedSeller.address.pincode}
                        </div>
                      </div>
                    )}
                    <div className="lg:col-span-2">
                      <label className="text-xs text-gray-500 font-medium">Country</label>
                      <div className="font-medium text-gray-900 text-sm p-3 bg-gray-50 rounded-lg mt-1 border border-gray-200">
                        {selectedSeller.address.country || "India"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-red-100 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Rejection Reason (Required if rejecting)</h3>
                    </div>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter detailed reason for rejection (this will be emailed to the seller)..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Required only for rejection. Be clear and professional in your feedback.
                    </p>
                  </div>

                  <div className="flex flex-col justify-end space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Decision Actions</span>
                      <span className="text-xs text-gray-400">ID: {selectedSeller._id?.substring(0, 8)}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => handleApprove(selectedSeller._id)}
                        disabled={approving || rejecting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg text-sm disabled:opacity-50 transition-all shadow-sm hover:shadow"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {approving ? "Approving..." : "Approve Seller"}
                      </button>
                      <button 
                        onClick={() => handleReject(selectedSeller._id)}
                        disabled={rejecting || approving || !rejectionReason.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg text-sm disabled:opacity-50 transition-all shadow-sm hover:shadow"
                      >
                        <XCircle className="w-4 h-4" />
                        {rejecting ? "Rejecting..." : "Reject Seller"}
                      </button>
                      <button 
                        onClick={closePopup}
                        disabled={approving || rejecting}
                        className="w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg text-sm disabled:opacity-50 transition-colors"
                      >
                        Cancel Review
                      </button>
                    </div>
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

export default AdminRequest;