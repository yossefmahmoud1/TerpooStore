import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { ClipLoader } from "react-spinners";
import { debounce } from "../utils/performance";

// Utility to get the full image URL
function getCleanImageUrl(img) {
  if (!img) return "";
  const fileName = img.split("/").pop().trim();
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  return `${protocol}://terpoostore.runasp.net/images/${fileName}`;
}

const Shop = () => {
  // أزلت الفلاتر الافتراضية، واجعل السعر من 500 إلى 20000
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 1. State للباجنيشن
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 1. State للفرز
  const [sortOption, setSortOption] = useState("");

  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Debounced search effect
  const debouncedSetSearch = useCallback(
    debounce((term) => setDebouncedSearchTerm(term), 300),
    []
  );

  // Update debounced search when search term changes
  useMemo(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // API hooks
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();

  // جلب الكاتيجوريز
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // 2. فلترة المنتجات بناءً على الفلاتر
  const filteredProducts = allProducts.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory
      ? product.categoryId === parseInt(selectedCategory)
      : true;
    return matchesName && matchesPrice && matchesCategory;
  });

  // 2. منطق الفرز
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "best-seller") {
      sorted = sorted.filter((p) => p.bestSeller === true);
    } else if (sortOption === "most-requested") {
      sorted = sorted.filter((p) => (p.purchaseCount || 0) > 0);
      sorted.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    }

    return sorted;
  }, [filteredProducts, sortOption]);

  // 3. باجنيشن على المنتجات المرتبة
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 20000]); // القيم الافتراضية الكاملة
    setSelectedCategory("");
    setSortOption(""); // إعادة تعيين خيار الفرز
  };

  // عند تغيير الفلاتر، أعد الصفحة للأولى
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, priceRange, selectedCategory]);

  // Scroll to top of products when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight uppercase mb-0"
            style={{ letterSpacing: "0.02em" }}
          >
            Shop Collection
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 max-w-2xl mx-auto mt-4 mb-0 text-center">
            Discover our complete range of professional handball shoes
          </p>
        </motion.div>

        {/* Modern Filter System */}
        <div className="mb-4 md:mb-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full bg-gradient-to-br from-purple-100 via-white to-orange-50 p-3 md:p-4 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-700/20 rounded-xl flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-purple-700" />
                </div>
                <span className="font-bold text-purple-900 text-sm md:text-base">
                  Filters & Search
                </span>
              </div>
              {(searchTerm ||
                selectedCategory ||
                priceRange[0] > 0 ||
                priceRange[1] < 200) && (
                <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                  Active
                </span>
              )}
            </button>
          </div>
          {/* Enhanced Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8 mb-4 md:mb-8 overflow-hidden ${
              showFilters ? "" : "hidden"
            } lg:block`}
          >
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-700 mb-4 md:mb-6 flex items-center">
              <Filter className="w-4 h-4 md:w-5 md:h-5 mr-2 text-slate-700" />
              Product Filters
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
            >
              {/* Enhanced Search */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Find your perfect shoe..."
                    className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-700 focus:border-slate-700 transition-all bg-white/90 font-bold text-slate-700 shadow-md hover:border-orange-400 focus:shadow-lg outline-none text-sm md:text-base"
                  />
                </div>
              </div>
              {/* Enhanced Price Range */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  Price Range
                </label>
                <div className="bg-slate-50 p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                    <span>{priceRange[0]} EGP</span>
                    <span>{priceRange[1]} EGP</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full accent-slate-700 h-2 rounded-lg bg-slate-200 focus:accent-slate-800"
                    />
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-slate-700 h-2 rounded-lg bg-slate-200 focus:accent-slate-800"
                    />
                  </div>
                </div>
              </div>
              {/* Category Filter + Sort Dropdown */}
              <div className="space-y-2 flex flex-col md:flex-row md:items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-700 focus:border-slate-700 transition-all bg-white/90 font-bold text-slate-700 shadow-md hover:border-orange-400 focus:shadow-lg outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="sort"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-700 focus:border-slate-700 transition-all bg-white/90 font-bold text-slate-700 shadow-md hover:border-orange-400 focus:shadow-lg outline-none"
                  >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="best-seller">Best Sellers</option>
                    <option value="most-requested">Most Requested</option>
                  </select>
                </div>
              </div>
              {/* Enhanced Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 text-slate-700 py-2 md:py-3 px-4 md:px-6 rounded-xl font-extrabold shadow hover:bg-orange-400 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-slate-700 text-sm md:text-base"
                >
                  <span>Reset All</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* DropDown للفرز */}
        {/* This section is now redundant as the dropdown is moved */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-bold text-purple-900">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={e => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white min-w-[180px] shadow-sm"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="sold-desc">Most Selling</option>
              <option value="sold-asc">Least Selling</option>
            </select>
          </div>
        </div> */}

        {/* Loading State */}
        {isLoadingProducts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center">
              <ClipLoader size={50} color="#7c3aed" />
              <p className="mt-4 text-gray-600 font-semibold">
                Loading products...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {productsError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Error loading products
            </h3>
            <p className="text-gray-500 mb-6">
              {productsError.message ||
                "Failed to load products. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Results Count */}
        {!isLoadingProducts && !productsError && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
        )}

        {/* Enhanced Products Grid */}
        {!isLoadingProducts && !productsError && sortedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10 px-1 md:px-0"
          >
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={{ ...product, address: "cairo egypt" }}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={resetFilters}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* أضف باجنيشن أسفل المنتجات */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded font-bold ${
                  currentPage === i + 1
                    ? "bg-purple-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
