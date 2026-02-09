import React from 'react';
import { TrendingUp, Users, Sparkles, CheckCircle, Shield, Phone, Mail, MapPin as MapPinIcon } from 'lucide-react';

const About = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">About RentX</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Your trusted powertools marketplace connecting renters and owners</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <TrendingUp className="w-7 h-7 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">Making professional tools accessible to everyone while helping owners earn from their idle equipment.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Users className="w-7 h-7 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Community First</h3>
          <p className="text-gray-600 leading-relaxed">Building a trusted community of verified sellers and satisfied renters across India.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Sparkles className="w-7 h-7 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Quality Assured</h3>
          <p className="text-gray-600 leading-relaxed">Every tool and seller is verified to ensure you get the best rental experience.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-xl mb-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Why Choose RentX?</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              RentX is India's leading powertools rental marketplace. We connect people who need professional tools for their projects with owners who want to earn from their equipment. With verified sellers, secure transactions, and 24/7 support, we make tool rental simple, safe, and affordable.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Verified Sellers</h4>
                  <p className="text-sm text-gray-600">All sellers undergo strict verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Secure Payments</h4>
                  <p className="text-sm text-gray-600">100% secure transaction protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">24/7 Support</h4>
                  <p className="text-sm text-gray-600">Round-the-clock customer service</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <h4 className="text-2xl font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Customer Support</div>
                  <div className="text-sm opacity-90">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Email</div>
                  <div className="text-sm opacity-90">support@rentx.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Headquarters</div>
                  <div className="text-sm opacity-90">Bangalore, Karnataka, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;