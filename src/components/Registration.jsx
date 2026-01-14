import React, { useState } from 'react';
import { User, Store, Phone, Mail, MapPin, CreditCard, Building2, Check } from 'lucide-react';

const RentXRegistration = () => {
  const [userType, setUserType] = useState('buyer');
  const [sellerType, setSellerType] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-white-900 to-slate-900 flex items-center justify-center p-4">
      
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-pink-500 rounded-2xl mb-4 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-red-400 text-transparent bg-clip-text">RentX</span>
          </h1>
          <p className="text-purple-200">Your PowerTools Marketplace</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
          
          {/* Buyer/Seller Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => { setUserType('buyer'); setSellerType(''); }}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                userType === 'buyer' ? 'bg-gradient-to-r from-purple-500 to-green-500 text-white shadow-lg' : 'bg-white/5 text-purple-200'
              }`}
            >
              <User className="w-5 h-5" />
              Buyer
            </button>
            <button
              onClick={() => { setUserType('seller'); setSellerType(''); }}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                userType === 'seller' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/5 text-purple-200'
              }`}
            >
              <Store className="w-5 h-5" />
              Seller
            </button>
          </div>

          {/* BUYER FORM */}
          {userType === 'buyer' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Buyer Registration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="email" placeholder="Email" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                
                <div className="flex gap-2">
                  <input type="tel" placeholder="Phone Number" maxLength="10" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <button onClick={() => setOtpSent(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-green-500 text-white rounded-xl font-medium">
                    {otpSent ? <Check className="w-5 h-5" /> : 'OTP'}
                  </button>
                </div>

                {otpSent && <input type="text" placeholder="Enter OTP" maxLength="6" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />}
                
                <input type="text" placeholder="Location" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Confirm Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-green-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all">
                Register as Buyer
              </button>
            </div>
          )}

          {/* SELLER TYPE SELECTION */}
          {userType === 'seller' && !sellerType && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Seller Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setSellerType('individual')} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 hover:border-purple-400/60 rounded-2xl p-6 transition-all hover:scale-105">
                  <User className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Individual Seller</h3>
                  <p className="text-purple-200 text-sm">Rent your personal tools</p>
                </button>

                <button onClick={() => setSellerType('organization')} className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30 hover:border-blue-400/60 rounded-2xl p-6 transition-all hover:scale-105">
                  <Store className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Organization / Store</h3>
                  <p className="text-purple-200 text-sm">Register your business</p>
                </button>
              </div>
            </div>
          )}

          {/* SELLER FORM - Individual */}
          {userType === 'seller' && sellerType === 'individual' && (
            <div>
              <button onClick={() => setSellerType('')} className="text-purple-300 hover:text-white mb-4">← Back</button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Individual Seller Registration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="email" placeholder="Email" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                
                <div className="flex gap-2">
                  <input type="tel" placeholder="Phone Number" maxLength="10" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <button onClick={() => setOtpSent(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium">
                    {otpSent ? <Check className="w-5 h-5" /> : 'OTP'}
                  </button>
                </div>

                {otpSent && <input type="text" placeholder="Enter OTP" maxLength="6" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />}
                
                <input type="text" placeholder="Location" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="text" placeholder="Aadhaar Number" maxLength="12" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Confirm Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all">
                Register as Individual Seller
              </button>
            </div>
          )}

          {/* SELLER FORM - Organization */}
          {userType === 'seller' && sellerType === 'organization' && (
            <div>
              <button onClick={() => setSellerType('')} className="text-purple-300 hover:text-white mb-4">← Back</button>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Organization Registration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Organization Name" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="text" placeholder="Owner Name" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="email" placeholder="Email" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                
                <div className="flex gap-2 md:col-span-2">
                  <input type="tel" placeholder="Phone Number" maxLength="10" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <button onClick={() => setOtpSent(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium">
                    {otpSent ? <Check className="w-5 h-5" /> : 'OTP'}
                  </button>
                </div>

                {otpSent && <input type="text" placeholder="Enter OTP" maxLength="6" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />}
                
                <input type="text" placeholder="Location" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="text" placeholder="Government ID / Aadhaar" maxLength="12" className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="password" placeholder="Confirm Password" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all">
                Register as Organization
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RentXRegistration;