import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, Building2, Briefcase,
    CreditCard, Edit, X, Lock, Eye, EyeOff, CheckCircle, AlertCircle
} from 'lucide-react';

const SellerProfile = () => {
    const token = localStorage.getItem('token');
        const userId = (() => {
        try {
            const id = localStorage.getItem('userId');
            return id ? JSON.parse(id) : null;
        } catch {
            return localStorage.getItem('userId') || null;
        }
    })();

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [editForm, setEditForm] = useState({
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        individualName: '',
        organizationName: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userId && token) {
            fetchSellerDetails();
        }
    }, [userId, token]);

    const fetchSellerDetails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/seller/mydetails/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data?.status === 'SUCCESS') {
                setSeller(data.data);
                setEditForm({
                    phone: data.data.phone || '',
                    street: data.data.address?.street || '',
                    city: data.data.address?.city || '',
                    state: data.data.address?.state || '',
                    pincode: data.data.address?.pincode || '',
                    individualName: data.data.sellerDetails?.individualName || '',
                    organizationName: data.data.sellerDetails?.organizationName || '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                showToast('error', 'Failed to load profile');
            }
        } catch {
            showToast('error', 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');

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
                phone: editForm.phone || '',
                address: {
                    street: editForm.street || '',
                    city: editForm.city || '',
                    state: editForm.state || '',
                    pincode: editForm.pincode || ''
                },
                sellerDetails: {}
            };

            if (seller?.sellerDetails?.sellerType === 'INDIVIDUAL') {
                updateData.sellerDetails.individualName = editForm.individualName || '';
            } else {
                updateData.sellerDetails.organizationName = editForm.organizationName || '';
            }

            if (editForm.newPassword) {
                updateData.password = editForm.newPassword;
            }

            const res = await fetch(`http://localhost:4000/api/seller/updateDetails/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await res.json();
            if (data?.status === 'SUCCESS') {
                showToast('success', 'Profile updated successfully');
                await fetchSellerDetails();
                setShowEditModal(false);
                setPasswordError('');
            } else {
                showToast('error', data?.message || 'Failed to update profile');
            }
        } catch {
            showToast('error', 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };

    const getDisplayName = () => {
        if (!seller) return 'N/A';
        if (seller.sellerDetails?.individualName) return seller.sellerDetails.individualName;
        if (seller.sellerDetails?.organizationName) return seller.sellerDetails.organizationName;
        return seller.email?.split('@')[0] || 'N/A';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    if (!token || !userId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
                <div className="text-center p-8">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Please login as a seller to view this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
                <div className="text-center p-8">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Seller Not Found</h2>
                    <p className="text-gray-600">Unable to load seller profile.</p>
                </div>
            </div>
        );
    }

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

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-sm text-gray-500">Your account information</p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {getDisplayName().charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{getDisplayName()}</h2>
                                <p className="text-orange-100 text-sm">{seller?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Account Type</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {seller?.sellerDetails?.sellerType === 'INDIVIDUAL' ? 'Individual Seller' : 'Organization'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="text-sm font-medium text-gray-900">{seller?.email}</p>
                                        {seller?.isEmailVerified && (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                        <p className="text-sm font-medium text-gray-900">{seller?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                {seller?.sellerDetails?.aadhaarNumber && (
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Aadhaar Number</p>
                                            <p className="text-sm font-medium text-gray-900 font-mono">
                                                {seller.sellerDetails.aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Address</p>
                                        {seller?.address ? (
                                            <p className="text-sm font-medium text-gray-900">
                                                {seller.address.street && <>{seller.address.street}<br /></>}
                                                {[seller.address.city, seller.address.state, seller.address.pincode].filter(Boolean).join(', ')}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400">Not provided</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(seller?.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <span className={`inline-block px-3 py-1 my-3 rounded-full text-xs font-medium border ${
                                            seller?.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-700 border-green-200' 
                                                : 'bg-red-100 text-red-700 border-red-200'
                                        }`}>
                                            {seller?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium flex items-center gap-2 shadow-md transition-all"
                        >
                            <Edit className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && seller && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center px-5 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setPasswordError('');
                                    setShowPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        {seller.sellerDetails?.sellerType === 'INDIVIDUAL' ? 'Full Name' : 'Organization Name'}
                                    </label>
                                    {seller.sellerDetails?.sellerType === 'INDIVIDUAL' ? (
                                        <input
                                            type="text"
                                            value={editForm.individualName}
                                            onChange={(e) => setEditForm({ ...editForm, individualName: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={editForm.organizationName}
                                            onChange={(e) => setEditForm({ ...editForm, organizationName: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder="Enter organization name"
                                            required
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200">
                                        {seller.email}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={editForm.state}
                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        maxLength="6"
                                        placeholder="6 digit pincode"
                                    />
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Change Password</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">Leave blank to keep current password</p>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={editForm.newPassword}
                                                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none pr-10"
                                                    placeholder="Enter new password"
                                                    minLength="6"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none pr-10"
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                                            {passwordError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setPasswordError('');
                                            setShowPassword(false);
                                            setShowConfirmPassword(false);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-orange-600/20"
                                    >
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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

export default SellerProfile;