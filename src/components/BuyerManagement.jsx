import React, { useState, useEffect } from 'react';
import {
    Users, MoreVertical, ChevronLeft, ChevronRight, X,
    Mail, Phone, MapPin, Calendar, RefreshCw, CheckCircle, AlertCircle,
    ToggleLeft, ToggleRight, Lock, Eye, EyeOff, User,
    Edit
} from 'lucide-react';

const BuyerManagement = () => {
    const token = localStorage.getItem('token');

    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [editForm, setEditForm] = useState({
        buyerName: '', phone: '', street: '', city: '', state: '', pincode: '',
        newPassword: '', confirmPassword: ''
    });

    useEffect(() => { fetchAllBuyers(); }, []);

    const fetchAllBuyers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/buyers/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === "SUCCESS") {
                const buyerUsers = data.data.filter(user =>
                    user.role?.includes('BUYER')
                );
                setBuyers(buyerUsers || []);
            }
        } catch {
            showToast('error', 'Failed to fetch buyers');
        } finally { setLoading(false); }
    };

    const handleToggleStatus = async (buyer) => {
        setUpdating(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/buyers/toggle-status/${buyer._id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === "SUCCESS") {
                showToast('success', `Buyer ${data.data.status.toLowerCase()}`);
                setBuyers(prev => prev.map(b => b._id === buyer._id ? { ...b, status: data.data.status } : b));
                setActiveDropdown(null);
            }
        } catch {
            showToast('error', 'Failed to toggle status');
        } finally { setUpdating(false); }
    };

    const handleUpdateBuyer = async (e) => {
        e.preventDefault();
        setPasswordError('');

        // Validate passwords if provided
        if (editForm.newPassword || editForm.confirmPassword) {
            if (editForm.newPassword !== editForm.confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }
            if (editForm.newPassword.length < 6) {
                setPasswordError('Password must be at least 6 characters');
                return;
            }
        }

        setUpdating(true);
        try {
            const updateData = {
                buyerDetails: {
                    buyerName: editForm.buyerName
                },
                phone: editForm.phone,
                address: {
                    street: editForm.street,
                    city: editForm.city,
                    state: editForm.state,
                    pincode: editForm.pincode
                }
            };

            // Add password only if provided
            if (editForm.newPassword) {
                updateData.password = editForm.newPassword;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/buyerUpdate/${selectedBuyer._id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            const data = await res.json();
            if (data.status === "SUCCESS") {
                showToast('success', 'Buyer updated successfully');
                setBuyers(prev => prev.map(b => b._id === selectedBuyer._id ? { ...b, ...data.data } : b));
                setShowEditModal(false);
                setActiveDropdown(null);
                setEditForm({
                    buyerName: '', phone: '', street: '', city: '', state: '', pincode: '',
                    newPassword: '', confirmPassword: ''
                });
                setPasswordError('');
            }
        } catch {
            showToast('error', 'Failed to update buyer');
        } finally { setUpdating(false); }
    };

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };

    const paginatedBuyers = buyers.slice((currentPage - 1) * 10, currentPage * 10);
    const totalPages = Math.ceil(buyers.length / 10);

    const getStatusColor = (status) => {
        if (status === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'INACTIVE') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const getDisplayName = (buyer) => {
        if (buyer.buyerDetails?.buyerName) return buyer.buyerDetails.buyerName;
        if (buyer.sellerDetails?.individualName) return buyer.sellerDetails.individualName;
        if (buyer.sellerDetails?.organizationName) return buyer.sellerDetails.organizationName;
        return buyer.email?.split('@')[0] || 'N/A';
    };

    const getUserRole = (buyer) => {
        const roles = [];
        if (buyer.role?.includes('BUYER')) roles.push('Buyer');
        if (buyer.role?.includes('SELLER')) roles.push('Seller');
        return roles.join(' / ');
    };

    const openEditModal = (buyer) => {
        setSelectedBuyer(buyer);
        setEditForm({
            buyerName: buyer.buyerDetails?.buyerName || buyer.sellerDetails?.individualName || buyer.sellerDetails?.organizationName || buyer.email?.split('@')[0] || '',
            phone: buyer.phone || '',
            street: buyer.address?.street || '',
            city: buyer.address?.city || '',
            state: buyer.address?.state || '',
            pincode: buyer.address?.pincode || '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordError('');
        setShowEditModal(true);
        setActiveDropdown(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 md:p-6 relative">
            {/* Centered Toast Notification */}
            {toast.show && (
                <div className="fixed top-13 right-14 transform -translate-x-1/2 z-50 animate-slideDown">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl border min-w-[300px] max-w-md ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        {toast.type === 'success' ?
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> :
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        }
                        <span className={toast.type === 'success' ? 'text-green-700 text-sm font-medium' : 'text-red-700 text-sm font-medium'}>
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Buyer Management</h1>
                    </div>
                    <button
                        onClick={fetchAllBuyers}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{buyers.filter(b => b.status === 'ACTIVE').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Inactive</p>
                        <p className="text-2xl font-bold text-red-600">{buyers.filter(b => b.status === 'INACTIVE').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">New This Month</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {buyers.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">BUYER</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">CONTACT</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">LOCATION</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">STATUS</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">JOINED</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {paginatedBuyers.map(b => (
                                            <tr key={b._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-bold text-orange-700">
                                                                {getDisplayName(b).charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {getDisplayName(b)}
                                                            </p>
                                                            {b.role?.length > 1 && (
                                                                <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                                                                    Buyer / Seller
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm">
                                                        <p className="text-gray-900 flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-gray-400" />
                                                            <span className="truncate max-w-[150px]">{b.email}</span>
                                                        </p>
                                                        {b.phone && (
                                                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                                                <Phone className="w-3 h-3 text-gray-400" />
                                                                {b.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {b.address ? (
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-gray-400" />
                                                            <span className="truncate max-w-[120px]">
                                                                {[b.address.city, b.address.state].filter(Boolean).join(', ') || 'N/A'}
                                                            </span>
                                                        </p>
                                                    ) : <span className="text-sm text-gray-400">N/A</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.status)}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-400" />
                                                        <span className="whitespace-nowrap text-xs">
                                                            {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 relative">
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === b._id ? null : b._id)}
                                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-600" />
                                                        </button>

                                                        {activeDropdown === b._id && (
                                                            <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">

                                                                <button
                                                                    onClick={() => openEditModal(b)}
                                                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-100"
                                                                >
                                                                    <Edit className="w-3 h-3 text-green-600" />
                                                                    Edit Info
                                                                </button>
                                                                <div className="border-t border-gray-100 my-1"></div>
                                                                <button
                                                                    onClick={() => handleToggleStatus(b)}
                                                                    disabled={updating}
                                                                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                                                                >
                                                                    {b.status === 'ACTIVE' ? (
                                                                        <>
                                                                            <ToggleLeft className="w-3.5 h-3.5 text-red-600" />
                                                                            <span className="text-red-600">Deactivate</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ToggleRight className="w-3.5 h-3.5 text-green-600" />
                                                                            <span className="text-green-600">Activate</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {buyers.length > 0 && totalPages > 1 && (
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                                    <p className="text-sm text-gray-600">
                                        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, buyers.length)} of {buyers.length}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedBuyer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex justify-between items-center px-5 py-3 border-b">
                            <h3 className="text-base font-semibold text-gray-900">Edit Buyer</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setPasswordError('');
                                    setShowPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleUpdateBuyer} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> Full Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.buyerName}
                                        onChange={(e) => setEditForm({ ...editForm, buyerName: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                        {selectedBuyer.email}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        {getUserRole(selectedBuyer)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        maxLength="10"
                                        placeholder="Enter 10 digit number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        value={editForm.street}
                                        onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        placeholder="Enter street address"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={editForm.state}
                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder="State"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={editForm.pincode}
                                        onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        maxLength="6"
                                        placeholder="6 digit pincode"
                                    />
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Change Password</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mb-2">Leave blank to keep current password</p>

                                    <div className="mb-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={editForm.newPassword}
                                                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none pr-10"
                                                placeholder="Enter new password"
                                                minLength="6"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={editForm.confirmPassword}
                                                onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none pr-10"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <p className="text-[10px] text-red-600 mt-1">{passwordError}</p>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="flex gap-3 px-5 py-3 border-t bg-gray-50 rounded-b-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setPasswordError('');
                                    setShowPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateBuyer}
                                disabled={updating}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {updating ? 'Updating...' : 'Update Buyer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default BuyerManagement;