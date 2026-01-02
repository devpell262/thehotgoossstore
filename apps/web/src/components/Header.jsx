"use client";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get cart count from localStorage
    const updateCartCount = () => {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        fetch(`/api/cart?sessionId=${sessionId}`)
          .then((res) => res.json())
          .then((data) => {
            const count =
              data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(count);
          })
          .catch(console.error);
      }
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const navItems = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header className="bg-white dark:bg-[#1E1E1E] sticky top-0 z-50 w-full border-b border-transparent dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between py-4 sm:py-5">
            {/* Brand block (left) */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-[#5F51FF] to-[#876DFF] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white transform rotate-12 rounded-sm"></div>
              </div>
              <div className="text-xl sm:text-2xl font-semibold">
                <span className="text-[#5F51FF]">The</span>
                <span className="text-[#1A1A1A] dark:text-white">HotGoss</span>
              </div>
            </a>

            {/* Primary navigation (center) - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:text-[#5F51FF] dark:focus:text-[#7B6DFF] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 focus:underline focus:underline-offset-4 transition-colors duration-150 text-base"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-colors duration-150"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Action area (right) - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/cart"
                className="relative text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:text-[#5F51FF] dark:focus:text-[#7B6DFF] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-colors duration-150"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#1E1E1E] shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
                Menu
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-colors duration-150"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="px-6 py-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-4 text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:text-[#5F51FF] dark:focus:text-[#7B6DFF] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-colors duration-150 text-lg border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/cart"
                className="flex items-center justify-between py-4 text-[#35374C] dark:text-gray-300 hover:text-[#5F51FF] dark:hover:text-[#7B6DFF] active:text-[#4A3FCC] dark:active:text-[#6B5DDD] focus:text-[#5F51FF] dark:focus:text-[#7B6DFF] focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-colors duration-150 text-lg border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
