"use client";
import { useEffect, useState } from "react";

export default function AdminAddProduct() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      window.location.href = "/admin/login";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted (not yet wired to DB)");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">➕ Add Product</h1>
          <a
            href="/admin/products"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            ← Back to Products
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Product title"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Product description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Price (USD)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="19.99"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Shipping Cost (USD)</label>
              <input
                name="shipping_cost"
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="4.99"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Categories</label>
            <input
              name="categories"
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="e.g. beauty, trending, tiktok"
            />
            <p className="text-xs text-gray-400 mt-1">
              You can store these as a comma-separated list for now.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}
