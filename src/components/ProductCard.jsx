import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Utility to get the full image URL
const baseUrl = "https://terpoostore.runasp.net";
function getFullImageUrl(img) {
  if (!img) return "";
  if (
    img.startsWith("http") ||
    img.startsWith("data:") ||
    img.startsWith("blob:")
  )
    return img.replace(/^https:/, "http:");
  return "http://terpoostore.runasp.net" + img;
}

export default function ProductCard({ product }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [null];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const intervalRef = useRef(null);

  // Start slideshow on hover
  const handleMouseEnter = () => {
    if (images.length <= 1) return;
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentImgIdx((idx) => (idx + 1) % images.length);
    }, 1000); // 1 second
  };
  // Stop slideshow and reset on mouse leave
  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImgIdx(0);
  };
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.045, boxShadow: "0 8px 32px 0 #c7d2fe55" }}
      className="group bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 flex flex-col items-center relative w-full max-w-xs md:max-w-sm shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badges */}
      {/* تم حذف شارة Best Seller من هنا لتظهر فقط فوق الصورة */}
      {/* صورة المنتج بمساحة مربعة وخلفية فاتحة وصورة تغطي المساحة */}
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl relative">
        {/* Badge */}
        {product.bestSeller && (
          <span className="absolute top-4 left-4 z-10 bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
            <svg
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              viewBox="0 0 20 20"
              width="18"
              height="18"
            >
              <path d="M10 2l2.39 4.84L18 7.27l-3.91 3.81L15.18 18 10 14.77 4.82 18l1.09-6.92L2 7.27l5.61-0.43L10 2z" />
            </svg>
            Best Seller
          </span>
        )}
        <img
          src={getFullImageUrl(images[currentImgIdx])}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 224'%3E%3Crect width='200' height='224' fill='%23f3f4f6'/%3E%3Ctext x='100' y='112' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 px-4 w-full justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImgIdx(idx)}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentImgIdx === idx
                  ? "border-orange-500 shadow-md"
                  : "border-gray-200 hover:border-slate-400"
              }`}
              style={{ outline: "none" }}
              tabIndex={-1}
            >
              <img
                src={getFullImageUrl(img)}
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
      {/* معلومات المنتج */}
      <div className="w-full flex flex-col gap-1 px-4 mt-3">
        {/* اسم القسم */}
        {product.category && (
          <div className="text-xs text-[#8b8fa3] font-semibold tracking-widest uppercase mb-1">
            {typeof product.category === "string"
              ? product.category
              : product.category.name}
          </div>
        )}
        {/* اسم المنتج */}
        <div className="text-slate-900 text-lg font-extrabold mb-1 truncate">
          {product.name}
        </div>
        {/* السعر وبلد الاستيراد */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-slate-900">
            {product.price} EGP
          </span>
          <span className="text-xs text-gray-500 font-semibold ml-2">
            {product.countryOfOrigin || "N/A"}
          </span>
        </div>
      </div>
      {/* زر التفاصيل وأيقونة info */}
      <div className="flex items-center gap-2 px-4 pb-4 mt-auto w-full">
        <Link
          to={`/product/${product.id}`}
          className="flex-1 bg-[#232b43] text-white py-3 rounded-xl font-bold text-base shadow hover:bg-[#17203a] transition text-center"
        >
          View Details
        </Link>
        <span className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
          {/* Globe icon for imported/global */}
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="26"
            height="26"
          >
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="6" ry="10" />
            <ellipse cx="12" cy="12" rx="10" ry="6" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}
