import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Globe, ArrowLeft, ShoppingCart } from "lucide-react";
import { useProduct, useIncrementPurchaseCount } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function getCleanImageUrl(img) {
  if (!img) return "";
  const fileName = img.split("/").pop().trim();
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  return `${protocol}://terpoostore.runasp.net/images/${fileName}`;
}

const ProductDetail = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: product, isLoading, error } = useProduct(parseInt(id));
  const incrementPurchaseMutation = useIncrementPurchaseCount();

  const getCategoryName = (categoryId) => {
    const categoryMap = {
      1: "Basic",
      2: "Pro",
      3: "Elite",
      4: "Youth",
    };
    return categoryMap[categoryId] || "N/A";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ClipLoader size={50} color="#a78bfa" />
      </div>
    );
  }
  if (error || !product) {
    return <Navigate to="/shop" replace />;
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const handleBuyNow = () => {
    // تحديث عدد المشتريات
    incrementPurchaseMutation.mutate(product.id);

    const phone = "01022926386";
    const imageUrl =
      Array.isArray(product.images) && product.images.length > 0
        ? getCleanImageUrl(product.images[0])
        : "";
    const message = `أرغب في معرفة التفاصيل عن المنتج: ${product.name}%0A${window.location.href}%0A${imageUrl}`;
    const whatsappUrl = `https://wa.me/2${phone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-2 md:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-slate-700 transition-colors text-base font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl shadow-2xl p-4 md:p-8 border border-gray-100">
          {/* Images */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full max-w-xs md:max-w-sm aspect-square bg-gray-100 rounded-2xl shadow-xl overflow-hidden group">
              <motion.img
                src={getCleanImageUrl(
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[selectedImageIndex]
                    : null
                )}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E")
                }
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.bestSeller && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                    <Star className="w-4 h-4" /> Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-purple-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    NEW
                  </span>
                )}
              </div>
            </div>
            {/* Thumbnails */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-slate-700 shadow-lg"
                        : "border-gray-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={getCleanImageUrl(image)}
                      alt={product.name + " " + (idx + 1)}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='40' y='40' font-family='Arial' font-size='8' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E")
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col gap-6 justify-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-700 mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-2xl font-extrabold text-slate-700">
                  {product.price}{" "}
                  <span className="text-base font-bold text-gray-400">EGP</span>
                </span>
                {hasDiscount && (
                  <span className="text-base font-semibold text-red-400 line-through opacity-70">
                    {product.oldPrice} EGP
                  </span>
                )}
                {product.categoryId && (
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                    {getCategoryName(product.categoryId)}
                  </span>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="bg-gray-50 p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-lg font-bold text-slate-700 mb-2">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>
            </div>
            {/* Info Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Address
                  </div>
                  <div className="text-gray-500 text-xs">{product.address}</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Country
                  </div>
                  <div className="text-gray-500 text-xs">
                    {product.countryOfOrigin || product.country || "N/A"}
                  </div>
                </div>
              </div>
            </div>
            {/* Features */}
            <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
              <h4 className="font-bold text-slate-700 mb-2 text-base">
                Why Choose This Product?
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span>Premium materials and construction</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span>Advanced grip technology</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span>Professional-grade performance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span>Trusted by athletes worldwide</span>
                </li>
              </ul>
            </div>
            {/* Buy Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl text-lg font-extrabold shadow-lg hover:bg-slate-900 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Buy Now - {product.price} EGP
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
