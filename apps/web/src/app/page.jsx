"use client";
import { useState, useEffect } from "react";
import { Star, TrendingUp, Package, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import EmailCapture from "../components/EmailCapture";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      const featured = data.products.filter((p) => p.is_featured).slice(0, 4);
      const trending = data.products.slice(0, 6);

      setFeaturedProducts(featured);
      setTrendingProducts(trending);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate final price for a product
  const calculateFinalPrice = (product) => {
    const basePrice = parseFloat(product.price || 0);
    const shippingCost = parseFloat(product.shipping_cost || 0);
    const profitMargin = parseFloat(product.profit_margin || 0);
    return (basePrice + shippingCost) * (1 + profitMargin / 100);
  };

  const categories = [
    {
      id: "1",
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop",
      count: "50+ Products",
    },
    {
      id: "2",
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop",
      count: "100+ Products",
    },
    {
      id: "3",
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop",
      count: "75+ Products",
    },
    {
      id: "4",
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop",
      count: "40+ Products",
    },
    {
      id: "5",
      name: "Sports & Outdoors",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&h=500&fit=crop",
      count: "60+ Products",
    },
    {
      id: "6",
      name: "Automotive & Tools",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop",
      count: "45+ Products",
    },
    {
      id: "7",
      name: "Toys & Games",
      image:
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop",
      count: "80+ Products",
    },
    {
      id: "8",
      name: "Pet Supplies",
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&h=500&fit=crop",
      count: "55+ Products",
    },
    {
      id: "9",
      name: "Health & Wellness",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop",
      count: "35+ Products",
    },
    {
      id: "10",
      name: "Kitchen & Dining",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
      count: "65+ Products",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Amazing quality and fast shipping! Will definitely order again.",
    },
    {
      name: "John D.",
      rating: 5,
      text: "Customer service was excellent. Product exceeded my expectations!",
    },
    {
      name: "Emily R.",
      rating: 5,
      text: "Best online shopping experience I've had. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#121212] dark:to-[#1A1A1A]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#5E5BFF] via-[#7B66E6] to-[#9079FF] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90 max-w-3xl mx-auto">
              Discover amazing products at unbeatable prices.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto mb-8">
              <p className="text-lg font-semibold mb-2">
                🚚 Shipping Discounts:
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
                <span>$50+ = 25% off</span>
                <span className="hidden sm:inline">•</span>
                <span>$100+ = 50% off</span>
                <span className="hidden sm:inline">•</span>
                <span>$150+ = 75% off</span>
                <span className="hidden sm:inline">•</span>
                <span className="font-bold">$200+ = FREE!</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="bg-white text-[#5E5BFF] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Now
              </a>
              <a
                href="#trending"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 active:scale-95 transition-all duration-200"
              >
                See What's Trending
              </a>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="bg-white/10 backdrop-blur-sm border-y border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Package className="w-6 h-6" />
                <span className="font-semibold">Free Shipping Over $50</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6" />
                <span className="font-semibold">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Star className="w-6 h-6" />
                <span className="font-semibold">Top Quality Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#0F0F0F] dark:text-white">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">{category.count}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending" className="py-16 bg-white dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-8 h-8 text-[#5E5BFF]" />
            <h2 className="text-4xl font-bold text-[#0F0F0F] dark:text-white">
              Trending Now
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-2xl text-[#696D7C] dark:text-gray-400">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trendingProducts.map((product) => {
                const finalPrice = calculateFinalPrice(product);

                return (
                  <a
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-[#5E5BFF]">
                        ${finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/shop"
              className="inline-block bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-[#4A47E6] hover:to-[#7B66E6] active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-[#1A1A2E] dark:to-[#16213E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 text-[#0F0F0F] dark:text-white">
              Featured Products
            </h2>
            <p className="text-center text-[#696D7C] dark:text-gray-400 mb-12 text-lg">
              Hand-picked favorites just for you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => {
                const finalPrice = calculateFinalPrice(product);

                return (
                  <a
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="relative">
                      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-[#5E5BFF] text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-[#1A1A1A] dark:text-white mb-3 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-[#5E5BFF]">
                        ${finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <section className="py-16 bg-white dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#0F0F0F] dark:text-white">
            What Our Customers Say
          </h2>
          <p className="text-center text-[#696D7C] dark:text-gray-400 mb-12 text-lg">
            Don't just take our word for it
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-[#1A1A1A] dark:text-gray-300 mb-4 text-lg">
                  "{testimonial.text}"
                </p>
                <p className="font-bold text-[#0F0F0F] dark:text-white">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 sm:mx-8 my-8 rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-[#5B50E0] to-[#8E7BFF] py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="font-semibold text-white mb-4 leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Ready to start shopping?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            Join our community and get exclusive access to the hottest products
            and latest deals.
          </p>
          <a
            href="/shop"
            className="inline-block font-semibold text-[#111111] bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg min-h-[48px] transition-all duration-200 ease-out hover:bg-[#F0F0F0] hover:text-[#5B50E0] active:bg-[#E0E0E0] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5B50E0] transform hover:shadow-lg"
          >
            Browse Collection
          </a>
        </div>
      </section>

      <Footer />
      <LiveChat />
      <EmailCapture />
    </div>
  );
}