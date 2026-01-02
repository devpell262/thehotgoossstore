"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = total >= 50 ? 0 : 5;
  const finalTotal = total + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: finalTotal,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();

        // Clear cart
        const sessionId = localStorage.getItem("sessionId");
        await fetch(`/api/cart?sessionId=${sessionId}`, { method: "DELETE" });

        // Update cart count
        window.dispatchEvent(new Event("cartUpdated"));

        // Redirect to success page
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        window.location.href = "/";
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-[#696D7C] dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-2xl text-[#696D7C] dark:text-gray-400 mb-6">
            Your cart is empty
          </p>
          <a
            href="/shop"
            className="inline-block bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white px-8 py-3 rounded-full font-semibold hover:from-[#4A47E6] hover:to-[#7B66E6] active:scale-95 transition-all duration-200"
          >
            Continue Shopping
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#0F0F0F] dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold text-[#0F0F0F] dark:text-white mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-[#4A47E6] hover:to-[#7B66E6] active:from-[#3D3ACC] active:to-[#6B5CCC] active:scale-95 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5E5BFF] focus:ring-opacity-50 transition-all duration-200 ease-out disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <h2 className="text-2xl font-bold text-[#0F0F0F] dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1A1A] dark:text-white text-sm">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#696D7C] dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-[#5E5BFF]">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-[#696D7C] dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#696D7C] dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-xl font-bold text-[#0F0F0F] dark:text-white">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
