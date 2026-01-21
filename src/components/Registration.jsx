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
      const res = await axios.post("http://localhost:4000/api/auth/send-otp", { email: form.email });
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
      const res = await axios.post("http://localhost:4000/api/auth/verify-otp", { 
        email: form.email, otp: form.otp 
      });
      if (res.data.status === "SUCCESS") {
        setOtpVerified(true);
        setMessage("✓ Email verified successfully");
        setErrors({ ...errors, otp: "" });
      }
    } catch (err) {
      setMessage("Invalid OTP");
      setErrors({ ...errors, otp: "Invalid OTP",err });
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
      const res = await axios.post("http://localhost:4000/api/auth/register", payload);
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

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg bg-orange-600">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-4xl font-black text-gray-900 mb-2">
            Rent<span className="text-orange-600 text-5xl">X</span>
          </h3>
          <p className="text-gray-600 text-lg font-medium">PowerTools Marketplace</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 px-14">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => { 
                setUserType('buyer'); 
                setSellerType(''); 
                setOtpSent(false); 
                setOtpVerified(false); 
                setMessage(""); 
                setErrors({});
              }}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${userType === 'buyer'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <User className="w-4 h-4" /> Buyer
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
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${userType === 'seller'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <Store className="w-4 h-4" /> Seller
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center font-medium ${message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {userType === 'seller' && !sellerType ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Seller Type</h2>
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => setSellerType('individual')}
                  className="p-8 border-2 border-gray-200 hover:border-orange-600 rounded-2xl text-left transition-all">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-orange-50">
                    <User className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual Seller</h3>
                  <p className="text-gray-600">Rent your personal tools</p>
                </button>
                <button onClick={() => setSellerType('organization')}
                  className="p-8 border-2 border-gray-200 hover:border-orange-600 rounded-2xl text-left transition-all">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-orange-50">
                    <Store className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Organization</h3>
                  <p className="text-gray-600">Register your business</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {sellerType && (
                <button onClick={() => { setSellerType(''); setErrors({}); }} className="text-orange-600 font-bold mb-4 hover:text-orange-700 transition-all">
                  ← Back
                </button>
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {userType === 'buyer' ? 'Buyer Registration' : sellerType === 'individual' ? 'Individual Seller Registration' : 'Organization Registration'}
              </h2>

              <div className="space-y-4">
                {userType === 'buyer' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="buyerName"
                        value={form.buyerName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.buyerName ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                        className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.dob ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                          className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.organizationName ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                        />
                        {errors.organizationName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.organizationName}</p>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="individualName"
                          value={form.individualName}
                          onChange={handleChange}
                          placeholder={sellerType === 'individual' ? 'Full Name' : 'Owner Name'}
                          className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.individualName ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                          className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.individualDob ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                        />
                        {errors.individualDob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.individualDob}</p>}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                  <button onClick={sendOtp} disabled={!form.email || loading}
                    className="px-6 py-3.5 bg-orange-600 text-white rounded-xl font-bold whitespace-nowrap min-w-[120px] disabled:opacity-50 transition-all">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send OTP'}
                  </button>
                </div>
                
                {otpSent && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="6-digit OTP"
                        maxLength="6"
                        className={`w-full px-4 py-3.5 bg-orange-50 border ${errors.otp ? 'border-red-400' : 'border-orange-300' } rounded-xl text-center font-bold tracking-widest outline-none`}
                      />
                      {errors.otp && <p className="text-red-500 text-xs mt-1 ml-1">{errors.otp}</p>}
                    </div>
                    <button onClick={verifyOtp} disabled={form.otp.length !== 6 || loading || otpVerified}
                      className={`px-6 py-3.5 rounded-xl font-bold whitespace-nowrap min-w-[120px] ${otpVerified ? 'bg-green-100 text-green-700' : 'bg-green-500 hover:bg-green-600 text-white'} disabled:opacity-50 transition-all`}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto bg-orange-50" /> : otpVerified ? <Check className="w-5 h-5 mx-auto" /> : 'Verify'}
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      maxLength="10"
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                        className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.aadhaarNumber ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                      />
                      {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.aadhaarNumber}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.street ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1 ml-1">{errors.street}</p>}
                </div>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.city ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.state ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
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
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.pincode ? 'border-red-400' : 'border-gray-200'} rounded-xl border-2 focus:ring-orange-100 focus:border-orange-300 outline-none`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <button onClick={registerUser} disabled={!otpVerified}
                className={`w-full mt-6 px-6 py-4 rounded-xl font-bold text-lg ${otpVerified ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} shadow-lg transition-all`}>
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