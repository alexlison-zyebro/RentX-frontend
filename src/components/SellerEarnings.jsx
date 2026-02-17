import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, RefreshCw, TrendingUp,
  CalendarDays, CalendarRange, ShoppingBag, BarChart3
} from 'lucide-react';

const SellerEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filter, setFilter] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login again');
      setLoading(false);
      return;
    }

    try {
      let url = `${import.meta.env.VITE_API_URL}/api/seller/earnings`;
      const params = new URLSearchParams();
      
      // Add date params for custom filter
      if (filter === 'custom' && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'SUCCESS') {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when filter changes
  useEffect(() => {
    fetchData();
  }, [filter]);

  // Set default dates on mount
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Handle custom filter apply
  const handleCustomFilter = () => {
    if (!startDate || !endDate) {
      setError('Please select both dates');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }
    
    setFilter('custom');
  };

  // Get earnings to display based on filter
  const getDisplayEarnings = () => {
    if (!data) return 0;
    
    switch (filter) {
      case 'monthly': return data.monthlyIncome || 0;
      case 'yearly': return data.yearlyIncome || 0;
      case 'custom': return data.totalIncome || 0;
      case 'all': return data.totalIncome || 0;
      default: return 0;
    }
  };

  // Get filter title
  const getTitle = () => {
    switch (filter) {
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      case 'all': return 'All Time';
      case 'custom': return 'Custom Range';
      default: return 'Earnings';
    }
  };

  // Get date range text
  const getRangeText = () => {
    const now = new Date();
    
    switch (filter) {
      case 'monthly':
        return `01/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.getDate()}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      case 'yearly':
        return `01/01/${now.getFullYear()} - ${now.getDate()}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      case 'custom':
        if (startDate && endDate) {
          const format = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          return `${format(new Date(startDate))} - ${format(new Date(endDate))}`;
        }
        return 'Select dates';
      case 'all':
        return 'All completed rentals';
      default:
        return '';
    }
  };

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h2>
          <p className="text-gray-600">Track your rental income and performance</p>
        </div>
        
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
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

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filter Period:</span>
        </div>
        
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('monthly')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'monthly' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <CalendarDays className="w-4 h-4" />
            This Month
          </button>
          <button
            onClick={() => setFilter('yearly')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'yearly' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <CalendarRange className="w-4 h-4" />
            This Year
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <Calendar className="w-4 h-4" />
            All Time
          </button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Custom Date Range:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            onClick={handleCustomFilter}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Apply Custom Filter
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8" />
              <span className="text-lg font-semibold">{getTitle()} Earnings</span>
            </div>
            <h1 className="text-5xl font-black mb-2">
              {formatMoney(getDisplayEarnings())}
            </h1>
            <p className="text-green-100">{getRangeText()}</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <h3 className="text-3xl font-black text-gray-900">
                {formatMoney(data?.totalIncome || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Lifetime earnings from all completed rentals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
              <h3 className="text-3xl font-black text-gray-900">
                {formatMoney(data?.monthlyIncome || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Earnings this month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Yearly Income</p>
              <h3 className="text-3xl font-black text-gray-900">
                {formatMoney(data?.yearlyIncome || 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CalendarRange className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Earnings this year</p>
        </div>
      </div>

      {/* Rental Statistics Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Rental Statistics</h3>
          <ShoppingBag className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Rentals */}
          <div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Total Rentals Completed</span>
                <span className="font-bold text-xl">{data?.totalRentals || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-600 h-3 rounded-full" 
                  style={{ width: `${Math.min((data?.totalRentals || 0) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Earnings per Rental</span>
                <span className="font-bold">
                  {data?.totalRentals > 0 
                    ? formatMoney((data.totalIncome / data.totalRentals))
                    : formatMoney(0)
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Average</span>
                <span className="font-bold">
                  {formatMoney((data?.yearlyIncome || 0) / Math.max(new Date().getMonth() + 1, 1))}
                </span>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Performance Metrics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Filter Applied</span>
                <span className="font-bold capitalize px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {filter}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date Range</span>
                <span className="font-bold text-sm">{getRangeText()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Period Earnings</span>
                <span className="font-bold text-green-600">
                  {formatMoney(getDisplayEarnings())}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projected Yearly</span>
                <span className="font-bold">
                  {formatMoney((data?.monthlyIncome || 0) * 12)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Earnings Message */}
      {(!data || data.totalRentals === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Earnings Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't completed any rentals yet. Once you have completed rentals, 
            your earnings will appear here.
          </p>
          <p className="text-sm text-gray-500">
            Earnings are calculated from rentals with "COMPLETED" status.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerEarnings;