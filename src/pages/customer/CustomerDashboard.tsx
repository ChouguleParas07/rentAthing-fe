import React from "react";
import { Link } from "react-router-dom";

const CustomerDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Customer Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Welcome to Stashly</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Start browsing items to rent or manage your existing bookings.
        </p>
        <Link
          to="/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Browse Items
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
