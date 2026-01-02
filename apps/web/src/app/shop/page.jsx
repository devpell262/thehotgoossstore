"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LiveChat from "../../components/LiveChat";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { id: "All", name: "All Products" },
    { id: "1", name: "Electronics" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Home & Living" },
    { id: "4", name: "Beauty" },
    { id: "5", name: "Sports & Outdoors" },
    { id: "6", name: "Automotive & Tools" },
    { id: "7", name: "Toys & Games" },
    { id: "8", name: "Pet Supplies" },
    { id: "9", name: "Health & Wellness" },
    { id: "10", name: "Kitchen & Dining" },
  ];

  useEffect(() => {
    // Load all products once
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.products || []);
        setProducts(data.products || []);
      })
      .catch(console.error);

    // Check for category in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryFromUrl = urlParams.get("category");
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, []);

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === "All") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) => {
        if (!product.category) return false;
        const tags = product.category.split(",").map((t) => t.trim());
        return tags.includes(selectedCategory);
      });
      setProducts(filtered);
    }
  }, [selectedCategory, allProducts]);

  // Calculate final price for a product
  const calculateFinalPrice = (product) => {
    const basePrice = parseFloat(product.price || 0);
    const shippingCost = parseFloat(product.shipping_cost || 0);
    const profitMargin = parseFloat(product.profit_margin || 0);
    return (basePrice + shippingCost) * (1 + profitMargin / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F0F0F] dark:text-white mb-4">
            Shop All Products
          </h1>
          <p className="text-lg text-[#696D7C] dark:text-gray-300">
            Discover our full collection of trending products
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white shadow-lg"
                  : "bg-white dark:bg-[#1E1E1E] text-[#1A1A1A] dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#5E5BFF] hover:text-[#5E5BFF]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const finalPrice = calculateFinalPrice(product);

            return (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2 group-hover:text-[#5E5BFF] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#696D7C] dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-[#5E5BFF]">
                      ${finalPrice.toFixed(2)}
                    </p>
                    <span className="text-sm text-[#696D7C] dark:text-gray-400">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-[#696D7C] dark:text-gray-400">
              No products found in this category
            </p>
          </div>
        )}
      </div>

      <Footer />
      <LiveChat />
    </div>
  );
}