"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LiveChat from "../../../components/LiveChat";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);

        // Build complete image array
        const images = [];
        if (data.product.image_url) {
          images.push(data.product.image_url);
        }

        // Add additional images
        if (data.product.additional_images) {
          try {
            const additionalImages = JSON.parse(data.product.additional_images);
            images.push(...additionalImages);
          } catch (e) {
            console.error("Error parsing additional images:", e);
          }
        }

        setAllImages(images);
      })
      .catch(console.error);
  }, [params.id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);

    // Get or create session ID
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(7) + Date.now();
      localStorage.setItem("sessionId", sessionId);
    }

    console.log("Adding to cart:", {
      sessionId,
      productId: product.id,
      quantity,
    });

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productId: product.id,
          quantity,
        }),
      });

      const data = await response.json();
      console.log("Add to cart response:", data);

      if (response.ok) {
        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));

        // Show success message
        alert("Added to cart!");
      } else {
        console.error("Failed to add to cart:", data);
        alert(`Failed to add to cart: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart: " + error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    if (!product) return 0;
    const basePrice = parseFloat(product.price || 0);
    const shippingCost = parseFloat(product.shipping_cost || 0);
    const profitMargin = parseFloat(product.profit_margin || 0);
    return (basePrice + shippingCost) * (1 + profitMargin / 100);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="text-xl text-[#696D7C] dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  const finalPrice = calculateFinalPrice();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden mb-4">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows - Only show if multiple images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 p-2 rounded-full hover:bg-white dark:hover:bg-black transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-[#0F0F0F] dark:text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 p-2 rounded-full hover:bg-white dark:hover:bg-black transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-[#0F0F0F] dark:text-white" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#696D7C]">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Gallery - Only show if multiple images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? "border-[#5E5BFF] ring-2 ring-[#5E5BFF]/50"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#5E5BFF]/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-[#0F0F0F] dark:text-white mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[#5E5BFF] mb-6">
              ${finalPrice.toFixed(2)}
            </p>

            <p className="text-lg text-[#696D7C] dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="text-sm text-[#696D7C] dark:text-gray-400 mb-2">
                Availability:{" "}
                <span
                  className={
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Shipping Policy */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-2">
                🚚 Shipping Discounts Available:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#696D7C] dark:text-gray-400">
                <div>
                  $50+ orders:{" "}
                  <span className="font-semibold text-[#5E5BFF]">25% off</span>
                </div>
                <div>
                  $100+ orders:{" "}
                  <span className="font-semibold text-[#5E5BFF]">50% off</span>
                </div>
                <div>
                  $150+ orders:{" "}
                  <span className="font-semibold text-[#5E5BFF]">75% off</span>
                </div>
                <div>
                  $200+ orders:{" "}
                  <span className="font-semibold text-green-600">FREE!</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="text-sm font-medium text-[#1A1A1A] dark:text-white mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Minus size={20} className="text-[#0F0F0F] dark:text-white" />
                </button>
                <span className="text-xl font-semibold text-[#0F0F0F] dark:text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus size={20} className="text-[#0F0F0F] dark:text-white" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#5E5BFF] to-[#9079FF] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-[#4A47E6] hover:to-[#7B66E6] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 shadow-lg"
            >
              <ShoppingCart size={24} />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Detailed Description Section */}
        {product.detailed_description && (
          <div className="mt-16 bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-[#0F0F0F] dark:text-white mb-6">
              Product Details
            </h2>
            <div
              className="product-description prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.detailed_description }}
            />
            <style jsx>{`
              .product-description {
                color: #696D7C !important;
                line-height: 1.8;
              }
              
              /* Force remove all background colors */
              .product-description * {
                background: none !important;
                background-color: transparent !important;
              }
              
              /* Force text to inherit our color scheme */
              .product-description p,
              .product-description span,
              .product-description div,
              .product-description li {
                color: inherit !important;
              }
              
              /* Dark mode text */
              :global(.dark) .product-description {
                color: #d1d5db !important;
              }
              
              /* Images */
              .product-description img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 1.5rem 0;
                display: block;
              }
              
              /* Headings */
              .product-description h1,
              .product-description h2,
              .product-description h3,
              .product-description h4,
              .product-description h5,
              .product-description h6 {
                color: #0F0F0F !important;
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-weight: bold;
              }
              
              :global(.dark) .product-description h1,
              :global(.dark) .product-description h2,
              :global(.dark) .product-description h3,
              :global(.dark) .product-description h4,
              :global(.dark) .product-description h5,
              :global(.dark) .product-description h6 {
                color: white !important;
              }
              
              /* Paragraphs */
              .product-description p {
                margin: 1rem 0;
              }
              
              /* Lists */
              .product-description ul,
              .product-description ol {
                margin: 1rem 0;
                padding-left: 2rem;
              }
              
              .product-description li {
                margin: 0.5rem 0;
              }
              
              /* Tables */
              .product-description table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
              }
              
              .product-description td,
              .product-description th {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              
              :global(.dark) .product-description td,
              :global(.dark) .product-description th {
                border-color: #374151;
              }
              
              .product-description th {
                font-weight: bold;
                color: #0F0F0F !important;
              }
              
              :global(.dark) .product-description th {
                color: white !important;
              }
              
              /* Strong/Bold */
              .product-description strong,
              .product-description b {
                font-weight: bold;
                color: inherit;
              }
              
              /* Links */
              .product-description a {
                color: #5E5BFF !important;
                text-decoration: underline;
              }
              
              .product-description a:hover {
                color: #4A47E6 !important;
              }
            `}</style>
          </div>
        )}
      </div>

      <Footer />
      <LiveChat />
    </div>
  );
}