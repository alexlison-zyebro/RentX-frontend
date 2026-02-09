import React from 'react';
import { Clock, Package, Calendar, DollarSign, Truck } from 'lucide-react';

const MyRentals = ({ token }) => {
  // This is a placeholder component
  console.log("token",token);
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">My Rentals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">View your rental history and manage active rentals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Active Rentals</h3>
              <p className="text-gray-600">Currently rented tools</p>
            </div>
          </div>
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active rentals</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Rental History</h3>
              <p className="text-gray-600">Past rentals and transactions</p>
            </div>
          </div>
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No rental history</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <Truck className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Renting!</h3>
          <p className="text-gray-700 mb-6">
            Browse our extensive collection of power tools and start your first rental today.
            All tools are verified and maintained by professional sellers.
          </p>
          <button className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all">
            Browse Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;