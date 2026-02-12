import React, { useState, useEffect } from 'react';
import {
    Users, MoreVertical, ChevronLeft, ChevronRight, X,
    Mail, Phone, MapPin, Calendar, RefreshCw, CheckCircle, AlertCircle,
    ToggleLeft, ToggleRight, User, Building2, Briefcase
} from 'lucide-react';

const SellerManagement = () => {
    const token = localStorage.getItem('token');

    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        fetchAllSellers();
    }, []);

    const fetchAllSellers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/api/admin/sellers/ListAll', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data?.status === 'SUCCESS') {
                const sellerUsers = data.data?.filter(user => 
                    user?.role?.includes('SELLER') && user?.status !== 'PENDING'
                ) || [];
                setSellers(sellerUsers);
            }
        } catch {
            showToast('error', 'Failed to fetch sellers');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (seller) => {
        if (!seller?._id) return;
        setUpdating(true);
        try {
            const res = await fetch(`http://localhost:4000/api/admin/sellers/toggle-status/${seller._id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data?.status === 'SUCCESS') {
                showToast('success', `Seller ${data.data?.status?.toLowerCase() || 'updated'}`);
                setSellers(prev => prev.map(s => 
                    s._id === seller._id ? { ...s, status: data.data?.status } : s
                ));
                setActiveDropdown(null);
            }
        } catch {
            showToast('error', 'Failed to toggle status');
        } finally {
            setUpdating(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };

    const paginatedSellers = sellers.slice((currentPage - 1) * 10, currentPage * 10);
    const totalPages = Math.ceil(sellers.length / 10);

    const getStatusColor = (status) => {
        if (status === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'INACTIVE') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const getDisplayName = (seller) => {
        if (!seller) return 'N/A';
        if (seller.sellerDetails?.individualName) return seller.sellerDetails.individualName;
        if (seller.sellerDetails?.organizationName) return seller.sellerDetails.organizationName;
        if (seller.buyerDetails?.buyerName) return seller.buyerDetails.buyerName;
        return seller.email?.split('@')[0] || 'N/A';
    };

    const getSellerType = (seller) => {
        if (!seller) return 'N/A';
        if (seller.sellerDetails?.sellerType === 'INDIVIDUAL') return 'Individual';
        if (seller.sellerDetails?.sellerType === 'ORGANIZATION') return 'Organization';
        return 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 relative">
            {toast.show && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl border min-w-[300px] ${
                        toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        {toast.type === 'success' ? 
                            <CheckCircle className="w-5 h-5 text-green-600" /> : 
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        }
                        <span className={toast.type === 'success' ? 'text-green-700 text-sm font-medium' : 'text-red-700 text-sm font-medium'}>
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}

            <div className="max-w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-md">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Seller Management</h1>
                            <p className="text-xs text-gray-500">Manage all registered sellers</p>
                        </div>
                    </div>
                    <button 
                        onClick={fetchAllSellers} 
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-xs flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Total Sellers</p>
                                <p className="text-xl font-bold text-gray-900">{sellers.length}</p>
                            </div>
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Active</p>
                                <p className="text-xl font-bold text-green-600">
                                    {sellers.filter(s => s?.status === 'ACTIVE').length}
                                </p>
                            </div>
                            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                                <ToggleRight className="w-4 h-4 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Inactive</p>
                                <p className="text-xl font-bold text-red-600">
                                    {sellers.filter(s => s?.status === 'INACTIVE').length}
                                </p>
                            </div>
                            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                                <ToggleLeft className="w-4 h-4 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">New This Month</p>
                                <p className="text-xl font-bold text-orange-600">
                                    {sellers.filter(s => {
                                        if (!s?.createdAt) return false;
                                        const date = new Date(s.createdAt);
                                        const now = new Date();
                                        return date.getMonth() === now.getMonth() && 
                                               date.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-visible">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">SELLER</th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">CONTACT</th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">LOCATION</th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">TYPE</th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">STATUS</th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">JOINED</th>
                                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedSellers.map(s => (
                                        <tr key={s._id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-bold text-white">
                                                            {getDisplayName(s).charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[130px]" title={getDisplayName(s)}>
                                                            {getDisplayName(s)}
                                                        </p>
                                                        {s.role?.length > 1 && (
                                                            <span className="inline-block px-1.5 py-0.5 mt-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium whitespace-nowrap">
                                                                Buyer / Seller
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-gray-700 flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <span className="truncate max-w-[130px]" title={s.email}>
                                                            {s.email}
                                                        </span>
                                                    </p>
                                                    {s.phone && (
                                                        <p className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                            {s.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                {s.address ? (
                                                    <p className="text-xs text-gray-700 flex items-start gap-1">
                                                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="truncate max-w-[90px]" title={`${s.address.city || ''} ${s.address.state || ''}`}>
                                                            {s.address.city || s.address.state || 'N/A'}
                                                        </span>
                                                    </p>
                                                ) : <span className="text-xs text-gray-400">N/A</span>}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-medium border w-20 text-center ${
                                                    s.sellerDetails?.sellerType === 'INDIVIDUAL' 
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {getSellerType(s)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-medium border w-16 text-center ${getStatusColor(s.status)}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                                                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span>{formatDate(s.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 relative">
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => setActiveDropdown(activeDropdown === s._id ? null : s._id)}
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white shadow-sm"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    {activeDropdown === s._id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                                <button 
                                                                    onClick={() => { handleToggleStatus(s); }} 
                                                                    disabled={updating}
                                                                    className={`flex items-center gap-2 w-full px-3 py-2 text-xs ${
                                                                        s.status === 'ACTIVE' 
                                                                            ? 'text-red-600 hover:bg-red-50' 
                                                                            : 'text-green-600 hover:bg-green-50'
                                                                    } disabled:opacity-50`}
                                                                >
                                                                    {s.status === 'ACTIVE' ? (
                                                                        <><ToggleLeft className="w-3.5 h-3.5" /> Deactivate</>
                                                                    ) : (
                                                                        <><ToggleRight className="w-3.5 h-3.5" /> Activate</>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedSellers.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-3 py-8 text-center">
                                                <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-gray-500 text-sm">No sellers found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {sellers.length > 0 && totalPages > 1 && (
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                                    <p className="text-xs text-gray-600">
                                        {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, sellers.length)} of {sellers.length}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                                            disabled={currentPage === 1} 
                                            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-3 py-1.5 bg-orange-600 text-white rounded text-xs font-semibold">
                                            {currentPage}/{totalPages}
                                        </span>
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                                            disabled={currentPage === totalPages} 
                                            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default SellerManagement;