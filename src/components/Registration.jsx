import React, { useState } from 'react';
import { User, Store, Mail, Phone, Building2, Check } from 'lucide-react';

const RentXRegistration = () => {
  const [userType, setUserType] = useState('buyer');
  const [sellerType, setSellerType] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">

      <div className="w-full max-w-4xl mb-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg" style={{ backgroundColor: '#6B1B5E' }}>
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-4xl font-black text-gray-900 mb-2">
            Rent<span style={{ color: '#6B1B5E' }}>X</span>
          </h3>
          <p className="text-gray-600 text-lg font-medium">PowerTools Marketplace</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 px-10">

          {/* Buyer/Seller Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => { setUserType('buyer'); setSellerType(''); setOtpSent(false); }}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${userType === 'buyer'
                ? 'text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              style={userType === 'buyer' ? { backgroundColor: '#6B1B5E' } : {}}
            >
              <User className="w-4 h-4" />
              Buyer
            </button>
            <button
              onClick={() => { setUserType('seller'); setSellerType(''); setOtpSent(false); }}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${userType === 'seller'
                ? 'text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              style={userType === 'seller' ? { backgroundColor: '#6B1B5E' } : {}}
            >
              <Store className="w-4 h-4" />
              Seller
            </button>
          </div>

          {/* BUYER FORM */}
          {userType === 'buyer' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Buyer Registration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <input
                  type="date"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <div className="flex gap-2 md:col-span-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="flex-1 px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none  transition-all"
                    style={{ '--tw-ring-color': '#6B1B5E' }}
                  />
                  <button
                    onClick={() => setOtpSent(true)}
                    className="h-12 w-24 text-sm text-white rounded-lg font-medium flex items-center justify-center mt-1
             bg-orange-300 hover:bg-orange-600 transition-colors"
                  >
                    {otpSent ? <Check className="w-4 h-4" /> : "Send OTP"}
                  </button>


                </div>

                {otpSent && (
                  <input
                    type="text"
                    placeholder="Enter 6-Digit OTP"
                    maxLength="6"
                    className="md:col-span-2 px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none font-bold text-center text-xl tracking-widest transition-all"
                    style={{ backgroundColor: '#FAF5F9', borderColor: '#d0bfd6', '--tw-ring-color': '#6B1B5E' }}
                  />
                )}

                <input
                  type="tel"
                  placeholder="Phone Number"
                  maxLength="10"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <input
                  type="text"
                  placeholder="Street Address"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <input
                  type="text"
                  placeholder="City"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <input
                  type="text"
                  placeholder="State"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  maxLength="6"
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6B1B5E' }}
                />
              </div>

              <button
                className="w-full mt-6 px-6 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:opacity-90"
                style={{ backgroundColor: '#6B1B5E' }}
              >
                Register as Buyer →
              </button>
            </div>
          )}

          {/* SELLER TYPE SELECTION */}
          {userType === 'seller' && !sellerType && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Seller Type</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setSellerType('individual')}
                  className="bg-white border-2 border-gray-200 hover:shadow-lg rounded-2xl p-8 transition-all text-left group"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6B1B5E'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all" style={{ backgroundColor: '#FAF5F9' }}>
                    <User className="w-8 h-8 transition-colors" style={{ color: '#6B1B5E' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual Seller</h3>
                  <p className="text-gray-600">Rent your personal tools</p>
                </button>

                <button
                  onClick={() => setSellerType('organization')}
                  className="bg-white border-2 border-gray-200 hover:shadow-lg rounded-2xl p-8 transition-all text-left group"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6B1B5E'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all" style={{ backgroundColor: '#FAF5F9' }}>
                    <Store className="w-8 h-8 transition-colors" style={{ color: '#6B1B5E' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Organization / Store</h3>
                  <p className="text-gray-600">Register your business</p>
                </button>
              </div>
            </div>
          )}

          {/* SELLER FORM - Individual */}
          {userType === 'seller' && sellerType === 'individual' && (
            <div>
              <button onClick={() => setSellerType('')} className="font-bold mb-4 hover:opacity-80" style={{ color: '#6B1B5E' }}>← Back</button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Individual Seller Registration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="md:col-span-2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="date" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="tel" placeholder="Phone Number" maxLength="10" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <div className="flex gap-2 md:col-span-2">
                  <input type="email" placeholder="Email Address" className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />
                  <button onClick={() => setOtpSent(true)} className="px-7 py-3.5 text-white rounded-xl font-bold transition-all shadow-md hover:opacity-90" style={{ backgroundColor: '#6B1B5E' }}>
                    {otpSent ? <Check className="w-5 h-5" /> : 'Send OTP'}
                  </button>
                </div>

                {otpSent && <input type="text" placeholder="Enter 6-Digit OTP" maxLength="6" className="md:col-span-2 px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 font-bold text-center text-xl tracking-widest transition-all" style={{ backgroundColor: '#FAF5F9', borderColor: '#6B1B5E', '--tw-ring-color': '#6B1B5E' }} />}

                <input type="text" placeholder="Street Address" className="md:col-span-2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="City" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="State" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="Pincode" maxLength="6" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="Aadhaar Number" maxLength="12" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />
              </div>

              <button className="w-full mt-6 px-6 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:opacity-90" style={{ backgroundColor: '#6B1B5E' }}>
                Register as Individual Seller →
              </button>
            </div>
          )}

          {/* SELLER FORM - Organization */}
          {userType === 'seller' && sellerType === 'organization' && (
            <div>
              <button onClick={() => setSellerType('')} className="font-bold mb-4 hover:opacity-80" style={{ color: '#6B1B5E' }}>← Back</button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Organization Registration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Organization Name" className="md:col-span-2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="Owner Name" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="tel" placeholder="Phone Number" maxLength="10" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <div className="flex gap-2 md:col-span-2">
                  <input type="email" placeholder="Email Address" className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />
                  <button onClick={() => setOtpSent(true)} className="px-7 py-3.5 text-white rounded-xl font-bold transition-all shadow-md hover:opacity-90" style={{ backgroundColor: '#6B1B5E' }}>
                    {otpSent ? <Check className="w-5 h-5" /> : 'Send OTP'}
                  </button>
                </div>

                {otpSent && <input type="text" placeholder="Enter 6-Digit OTP" maxLength="6" className="md:col-span-2 px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 font-bold text-center text-xl tracking-widest transition-all" style={{ backgroundColor: '#FAF5F9', borderColor: '#6B1B5E', '--tw-ring-color': '#6B1B5E' }} />}

                <input type="text" placeholder="Street Address" className="md:col-span-2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="City" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="State" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="Pincode" maxLength="6" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />

                <input type="text" placeholder="Government ID / Aadhaar" maxLength="12" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': '#6B1B5E' }} />
              </div>

              <button className="w-full mt-6 px-6 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:opacity-90" style={{ backgroundColor: '#6B1B5E' }}>
                Register as Organization →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RentXRegistration;