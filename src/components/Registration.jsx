import React, { useState } from 'react';
import { User, Store, Building2, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [userType, setUserType] = useState('buyer');
  const [sellerType, setSellerType] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "", otp: "", phone: "", buyerName: "", dob: "",
    street: "", city: "", state: "", pincode: "",
    individualName: "", individualDob: "", organizationName: "", aadhaarNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePincode = (pincode) => /^\d{6}$/.test(pincode);
  const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);

  const validateForm = () => {
    const newErrors = {};

    if (userType === 'buyer') {
      if (!form.buyerName.trim()) newErrors.buyerName = "Full Name is required";
      if (!form.dob) newErrors.dob = "Date of Birth is required";
    }

    if (userType === 'seller') {
      if (sellerType === 'organization' && !form.organizationName.trim()) {
        newErrors.organizationName = "Organization Name is required";
      }
      if (!form.individualName.trim()) {
        newErrors.individualName = sellerType === 'individual' ? "Full Name is required" : "Owner Name is required";
      }
      if (!form.individualDob) {
        newErrors.individualDob = "Date of Birth is required";
      }
      if (!form.aadhaarNumber) {
        newErrors.aadhaarNumber = "Aadhaar Number is required";
      } else if (!validateAadhaar(form.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
      }
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone) {
      newErrors.phone = "Phone Number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!form.street.trim()) newErrors.street = "Street Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    if (!form.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!validatePincode(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!form.email) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }
    if (!validateEmail(form.email)) {
      setErrors({ ...errors, email: "Invalid email format" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { email: form.email });
      if (res.data.status === "SUCCESS") {
        setOtpSent(true);
        setOtpVerified(false);
        setMessage("OTP sent to email");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!form.otp || form.otp.length !== 6) {
      setErrors({ ...errors, otp: "Enter 6-digit OTP" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email: form.email, otp: form.otp, purpose: "REGISTER"
      });
      if (res.data.status === "SUCCESS") {
        setOtpVerified(true);
        setMessage("✓ Email verified successfully");
        setErrors({ ...errors, otp: "" });
      }
    } catch (err) {
      setMessage("Invalid OTP");
      setErrors({ ...errors, otp: "Invalid OTP", err });
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    if (!otpVerified) {
      setMessage("Please verify your email first");
      return;
    }

    if (!validateForm()) {
      setMessage("Please fill all required fields correctly");
      return;
    }

    const payload = {
      email: form.email,
      phone: form.phone,
      address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode }
    };

    if (userType === "buyer") {
      payload.buyerDetails = { buyerName: form.buyerName, dob: form.dob };
    }

    if (userType === "seller") {
      payload.sellerDetails = {
        sellerType: sellerType === 'individual' ? 'INDIVIDUAL' : 'ORGANIZATION',
        individualName: form.individualName,
        individualDob: form.individualDob,
        organizationName: form.organizationName || null,
        aadhaarNumber: form.aadhaarNumber
      };
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, payload);
      alert("✓ Registration successful!");
      console.log(res)
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.status === 409) {
        setMessage("Email already exists");
      } else {
        alert("Registration failed. Please try again");
      }
    }
  };

  const inputBase = "w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-orange-100 focus:border-orange-300 outline-none text-sm sm:text-base";
  const inputError = "border-red-400";
  const inputNormal = "border-gray-200";

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-xl lg:max-w-4xl mb-6 sm:mb-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-3 sm:mb-4 shadow-lg bg-orange-600">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Rent<span className="text-orange-600 text-4xl sm:text-5xl">X</span>
          </h3>
          <p className="text-gray-600 text-base sm:text-lg font-medium">PowerTools Marketplace</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8 lg:p-12 lg:px-14">

          {/* User Type Toggle */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => {
                setUserType('buyer');
                setSellerType('');
                setOtpSent(false);
                setOtpVerified(false);
                setMessage("");
                setErrors({});
              }}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-bold transition-all text-sm sm:text-base ${userType === 'buyer'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <User className="w-4 h-4 flex-shrink-0" /> Buyer
            </button>
            <button
              onClick={() => {
                setUserType('seller');
                setSellerType('');
                setOtpSent(false);
                setOtpVerified(false);
                setMessage("");
                setErrors({});
              }}
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all text-sm sm:text-base ${userType === 'seller'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <Store className="w-4 h-4 flex-shrink-0" /> Seller
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center font-medium text-sm sm:text-base ${message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Seller Type Selection */}
          {userType === 'seller' && !sellerType ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Seller Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <button onClick={() => setSellerType('individual')}
                  className="p-5 sm:p-8 border-2 border-gray-200 hover:border-orange-600 rounded-2xl text-left transition-all">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 bg-orange-50">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Individual Seller</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Rent your personal tools</p>
                </button>
                <button onClick={() => setSellerType('organization')}
                  className="p-5 sm:p-8 border-2 border-gray-200 hover:border-orange-600 rounded-2xl text-left transition-all">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 bg-orange-50">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Organization</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Register your business</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {sellerType && (
                <button onClick={() => { setSellerType(''); setErrors({}); }} className="text-orange-600 font-bold mb-4 hover:text-orange-700 transition-all text-sm sm:text-base">
                  ← Back
                </button>
              )}

              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {userType === 'buyer' ? 'Buyer Registration' : sellerType === 'individual' ? 'Individual Seller Registration' : 'Organization Registration'}
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {/* Buyer Fields */}
                {userType === 'buyer' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <input
                        type="text"
                        name="buyerName"
                        value={form.buyerName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`${inputBase} ${errors.buyerName ? inputError : inputNormal}`}
                      />
                      {errors.buyerName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.buyerName}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        placeholder="Date of Birth"
                        onFocus={(e) => e.target.type = 'date'}
                        className={`${inputBase} ${errors.dob ? inputError : inputNormal}`}
                      />
                      {errors.dob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.dob}</p>}
                    </div>
                  </div>
                ) : (
                  <>
                    {sellerType === 'organization' && (
                      <div>
                        <input
                          type="text"
                          name="organizationName"
                          value={form.organizationName}
                          onChange={handleChange}
                          placeholder="Organization Name"
                          className={`${inputBase} ${errors.organizationName ? inputError : inputNormal}`}
                        />
                        {errors.organizationName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.organizationName}</p>}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <input
                          type="text"
                          name="individualName"
                          value={form.individualName}
                          onChange={handleChange}
                          placeholder={sellerType === 'individual' ? 'Full Name' : 'Owner Name'}
                          className={`${inputBase} ${errors.individualName ? inputError : inputNormal}`}
                        />
                        {errors.individualName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.individualName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="individualDob"
                          value={form.individualDob}
                          onChange={handleChange}
                          placeholder={sellerType === 'individual' ? 'Date of Birth' : 'Owner Date of Birth'}
                          onFocus={(e) => e.target.type = 'date'}
                          className={`${inputBase} ${errors.individualDob ? inputError : inputNormal}`}
                        />
                        {errors.individualDob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.individualDob}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Email + OTP Send */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                  <button
                    onClick={sendOtp}
                    disabled={!form.email || loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 bg-orange-600 text-white rounded-xl font-bold whitespace-nowrap min-w-[110px] sm:min-w-[120px] disabled:opacity-50 transition-all text-sm sm:text-base"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send OTP'}
                  </button>
                </div>

                {/* OTP Verify */}
                {otpSent && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="6-digit OTP"
                        maxLength="6"
                        className={`${inputBase} border-orange-300 bg-orange-50 text-center font-bold tracking-widest ${errors.otp ? inputError : ''}`}
                      />
                      {errors.otp && <p className="text-red-500 text-xs mt-1 ml-1">{errors.otp}</p>}
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={form.otp.length !== 6 || loading || otpVerified}
                      className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold whitespace-nowrap min-w-[110px] sm:min-w-[120px] text-sm sm:text-base ${otpVerified ? 'bg-green-100 text-green-700' : 'bg-green-500 hover:bg-green-600 text-white'} disabled:opacity-50 transition-all`}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto bg-orange-50" /> : otpVerified ? <Check className="w-5 h-5 mx-auto" /> : 'Verify'}
                    </button>
                  </div>
                )}

                {/* Phone + Aadhaar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      maxLength="10"
                      className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                  </div>

                  {userType === 'seller' && (
                    <div>
                      <input
                        type="text"
                        name="aadhaarNumber"
                        value={form.aadhaarNumber}
                        onChange={handleChange}
                        placeholder="Aadhaar Number"
                        maxLength="12"
                        className={`${inputBase} ${errors.aadhaarNumber ? inputError : inputNormal}`}
                      />
                      {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.aadhaarNumber}</p>}
                    </div>
                  )}
                </div>

                {/* Street */}
                <div>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className={`${inputBase} ${errors.street ? inputError : inputNormal}`}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1 ml-1">{errors.street}</p>}
                </div>

                {/* City / State / Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`${inputBase} ${errors.city ? inputError : inputNormal}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={`${inputBase} ${errors.state ? inputError : inputNormal}`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      maxLength="6"
                      className={`${inputBase} ${errors.pincode ? inputError : inputNormal}`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={registerUser}
                disabled={!otpVerified}
                className={`w-full mt-5 sm:mt-6 px-6 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg ${otpVerified ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} shadow-lg transition-all`}
              >
                Register as {userType === 'buyer' ? 'Buyer' : sellerType === 'individual' ? 'Individual Seller' : 'Organization'} →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;