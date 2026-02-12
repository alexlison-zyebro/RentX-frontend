import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, RefreshCw, Filter, Search,
  ChevronLeft, ChevronRight, Clock, CheckCircle,
  Package, User
} from 'lucide-react';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [summary, setSummary] = useState({
    totalRentals: 0,
    ongoingCount: 0,
    completedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    setMonth(String(today.getMonth() + 1));
  }, []);

  // Fetch rentals
  const fetchRentals = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login again');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {};

      if (filterType === 'ongoing') {
        requestBody.statusGroup = 'ongoing';
      } else if (filterType === 'completed') {
        requestBody.statusGroup = 'completed';
      } else if (filterType === 'date' && startDate && endDate) {
        requestBody.startDate = startDate;
        requestBody.endDate = endDate;
      } else if (filterType === 'month' && month && year) {
        requestBody.month = parseInt(month);
        requestBody.year = parseInt(year);
      }
      
      const response = await fetch('http://localhost:4000/api/admin/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRentals(result.data || []);
        setSummary(result.summary || {
          totalRentals: 0,
          ongoingCount: 0,
          completedCount: 0
        });
        setCurrentPage(1);
      } else {
        setError(result.message || 'Failed to fetch rentals');
      }
    } catch (err) {
        console.log("error ->",err)
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [filterType]);

  // Filter by search
  const filteredRentals = rentals.filter(rental => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (rental.customerName && rental.customerName.toLowerCase().includes(term)) ||
      (rental.sellerName && rental.sellerName.toLowerCase().includes(term)) ||
      (rental.productName && rental.productName.toLowerCase().includes(term))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'COLLECTED': return 'bg-purple-100 text-purple-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReset = () => {
    setFilterType('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Management</h2>
          <p className="text-gray-600">View all rental requests across the platform</p>
        </div>
        <button
          onClick={fetchRentals}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Rentals</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalRentals}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Ongoing</p>
              <p className="text-3xl font-bold text-gray-900">{summary.ongoingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{summary.completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filter Rentals</span>
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg capitalize ${
              filterType === 'all' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('ongoing')}
            className={`px-4 py-2 rounded-lg capitalize flex items-center gap-1 ${
              filterType === 'ongoing' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Ongoing
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-4 py-2 rounded-lg capitalize flex items-center gap-1 ${
              filterType === 'completed' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed
          </button>
          <button
            onClick={() => setFilterType('date')}
            className={`px-4 py-2 rounded-lg capitalize ${
              filterType === 'date' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Date Range
          </button>
          <button
            onClick={() => setFilterType('month')}
            className={`px-4 py-2 rounded-lg capitalize ${
              filterType === 'month' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month/Year
          </button>
        </div>

        {/* Date Filters - Only show when date or month is selected */}
        {filterType === 'date' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {filterType === 'month' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Apply Buttons - Show only when date or month filter is active */}
        {(filterType === 'date' || filterType === 'month') && (
          <div className="flex gap-3">
            <button
              onClick={fetchRentals}
              disabled={(filterType === 'date' && (!startDate || !endDate)) || 
                       (filterType === 'month' && (!month || !year))}
              className={`px-6 py-2 rounded-lg transition-colors ${
                (filterType === 'date' && (!startDate || !endDate)) || 
                (filterType === 'month' && (!month || !year))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Current View */}
      <div className="bg-orange-50 rounded-lg p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-orange-700 capitalize">
            {filterType === 'all' && 'All Rentals'}
            {filterType === 'ongoing' && 'Ongoing Rentals'}
            {filterType === 'completed' && 'Completed Rentals'}
            {filterType === 'date' && 'Date Range'}
            {filterType === 'month' && 'Month/Year'}
          </span>
          <span className="text-sm text-orange-600 ml-2">
            {filteredRentals.length} {filteredRentals.length === 1 ? 'rental' : 'rentals'} found
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, seller or product name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 p-2 border-none focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Seller</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Dates</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRentals.length > 0 ? (
                paginatedRentals.map((rental, index) => (
                  <tr key={`${rental.id || index}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{rental.customerName || 'N/A'}</p>
                          <p className="text-xs text-gray-500 truncate">{rental.customerEmail || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {rental.productImage ? (
                          <img 
                            src={`http://localhost:4000${rental.productImage}`} 
                            alt={rental.productName || 'Product'} 
                            className="w-8 h-8 object-cover rounded flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="font-medium text-gray-900 truncate">{rental.productName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{rental.sellerName || 'N/A'}</p>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full inline-block">
                          {rental.sellerType || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">Qty: {rental.quantity || 0}</p>
                      <p className="text-sm text-gray-700">{rental.totalDays || 0} days</p>
                      <p className="text-xs text-gray-500">₹{rental.pricePerDay || 0}/day</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600">From: {formatDate(rental.startDate)}</p>
                      <p className="text-xs text-gray-600">To: {formatDate(rental.endDate)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(rental.status)}`}>
                        {rental.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                      {formatMoney(rental.totalPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-900 font-medium mb-1">No rentals found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRentals.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRentals.length)} of {filteredRentals.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRentals;