"use client";
import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      window.location.href = "/admin/login";
      return;
    }

    async function loadProducts() {
      try {
        const res = await fetch("/api/admin/products/list");
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📦 Product Management</h1>
          <a
            href="/admin"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            ← Back to Dashboard
          </a>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">
            Manage your catalog pulled from the database.
          </p>
          <a
            href="/admin/products/add"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            ➕ Add Product
          </a>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Categories</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Shipping</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No products yet. Use “Add Product” to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-700 hover:bg-gray-750"
                  >
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {p.categories}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${Number(p.shipping_cost).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
