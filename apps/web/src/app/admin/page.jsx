"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authStatus = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      window.location.href = "/admin/login";
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🏪 The Hot Goss Store - Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm text-blue-200 mt-2">Total items in catalog</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm text-green-200 mt-2">Pending orders</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold">$0.00</p>
            <p className="text-sm text-purple-200 mt-2">Total earnings</p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/admin/products" 
              className="block bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg text-center font-semibold transition"
            >
              📦 Manage Products
            </a>
            <a 
              href="/admin/orders" 
              className="block bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg text-center font-semibold transition"
            >
              📋 View Orders
            </a>
            <a 
              href="/api/admin/init-database" 
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg text-center font-semibold transition"
            >
              🗄️ Initialize Database
            </a>
            <a 
              href="/shop" 
              className="block bg-gray-600 hover:bg-gray-700 px-6 py-4 rounded-lg text-center font-semibold transition"
            >
              🛍️ View Store
            </a>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <p className="text-gray-400">No recent activity. Start by importing products from CJDropshipping.</p>
        </div>
      </div>
    </div>
  );
}
