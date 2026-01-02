"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LiveChat from "../../components/LiveChat";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
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

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const sessionId = localStorage.getItem("sessionId");
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          itemId,
          quantity: newQuantity,
        }),
      });
      loadCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    const sessionId = localStorage.getItem("sessionId");
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          itemId,
        }),
      });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate final price per product (same as product page and admin)
  const calculateFinalPrice = (item) => {
    const basePrice = parseFloat(item.price || 0);
    const shippingCost = parseFloat(item.shipping_cost || 0);
    const profitMargin = parseFloat(item.profit_margin || 0);
    return (basePrice + shippingCost) * (1 + profitMargin / 100);
  };

  // Calculate subtotal (sum of all items with final prices)
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const finalPrice = calculateFinalPrice(item);
      return sum + finalPrice * item.quantity;
    }, 0);
  };

  // Calculate tax (8% of subtotal)
  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  // Calculate shipping with tiered discounts
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    const baseShipping = 5.99;

    if (subtotal >= 200) return 0; // 100% off (free)
    if (subtotal >= 150) return baseShipping * 0.25; // 75% off
    if (subtotal >= 100) return baseShipping * 0.5; // 50% off
    if (subtotal >= 50) return baseShipping * 0.75; // 25% off

    return baseShipping; // Full price
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleCheckout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId || cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Here you would redirect to checkout page or payment processing
    alert("Checkout functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl text-[#696D7C] dark:text-gray-400">
            Loading cart...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-[#696D7C] dark:text-gray-600 mb-4" />
            <h2 className="text-3xl font-bold text-[#0F0F0F] dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-lg text-[#696D7C] dark:text-gray-400 mb-8">
              Add some products to get started!
            </p>
            <a
              href="/shop"
              className="inline-block bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#4A47E6] hover:to-[#7B66E6] transition-all"
            >
              Continue Shopping
            </a>
          </div>
        </div>
        <Footer />
        <LiveChat />
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#0F0F0F] dark:text-white mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const finalPrice = calculateFinalPrice(item);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0F0F0F] dark:text-white">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 p-2"
                          title="Remove from cart"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-semibold text-[#0F0F0F] dark:text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="p-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#5E5BFF]">
                            ${(finalPrice * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-[#696D7C] dark:text-gray-400">
                            ${finalPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-4">
              <h2 className="text-2xl font-bold text-[#0F0F0F] dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#696D7C] dark:text-gray-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#696D7C] dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#696D7C] dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {/* Shipping tier messages */}
                {subtotal < 200 && (
                  <div className="text-xs text-[#696D7C] dark:text-gray-400">
                    {subtotal < 50 && (
                      <p>
                        Spend ${(50 - subtotal).toFixed(2)} more for 25% off
                        shipping!
                      </p>
                    )}
                    {subtotal >= 50 && subtotal < 100 && (
                      <p>
                        Spend ${(100 - subtotal).toFixed(2)} more for 50% off
                        shipping!
                      </p>
                    )}
                    {subtotal >= 100 && subtotal < 150 && (
                      <p>
                        Spend ${(150 - subtotal).toFixed(2)} more for 75% off
                        shipping!
                      </p>
                    )}
                    {subtotal >= 150 && subtotal < 200 && (
                      <p>
                        Spend ${(200 - subtotal).toFixed(2)} more for FREE
                        shipping!
                      </p>
                    )}
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#0F0F0F] dark:text-white">
                    <span>Total</span>
                    <span className="text-[#5E5BFF]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white py-4 rounded-xl font-semibold text-lg hover:from-[#4A47E6] hover:to-[#7B66E6] active:scale-95 transition-all shadow-lg"
              >
                Proceed to Checkout
              </button>

              <a
                href="/shop"
                className="block text-center text-[#5E5BFF] hover:text-[#4A47E6] mt-4 font-medium"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <LiveChat />
    </div>
  );
}