import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  LogOut,
  Package,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useMostRequestedProducts,
} from "../hooks/useProducts";
import {
  useAdminLogin,
  useAdminLogout,
  useCurrentUser,
} from "../hooks/useAuth";
import CategoryManagement from "../components/CategoryManagement";
import Swal from "sweetalert2";
import { productService } from "../services/productService";
import categoryService from "../services/categoryService";
import { getFullImageUrl } from "../utils/imageUtils";
import logo from "/logo.png"; // Added import for logo

// Utility to get the full image URL
function getCleanImageUrl(img) {
  if (!img) return "";
  const fileName = img.split("/").pop().trim();
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  return `${protocol}://terpoostore.runasp.net/images/${fileName}`;
}

const Admin = () => {
  // حماية الأدمن: إذا لم يكن الأدمن مسجل دخول تظهر فورم تسجيل الدخول
  const isAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("isAdmin") === "true" &&
    localStorage.getItem("adminLoggedIn") === "true";

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState([]);

  // 1. أضف state للفلترة والباجنيشن
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBestSeller, setFilterBestSeller] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Hook to get most requested products
  const { data: mostRequestedProducts, isLoading: isLoadingMostRequested } =
    useMostRequestedProducts();

  // 1. أضف state للأخطاء
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [""],
    description: "",
    address: "",
    country: "",
    categoryId: "", // <-- استخدم categoryId بدلاً من category
    bestSeller: false,
  });
  const [openActionsId, setOpenActionsId] = useState(null);

  // دالة مساعدة لتحويل categoryId إلى اسم التصنيف
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      1: "Basic",
      2: "Pro",
      3: "Elite",
      4: "Youth",
    };
    return categoryMap[categoryId] || "Basic";
  };

  // تنظيف URLs المحلية عند إغلاق المكون
  useEffect(() => {
    return () => {
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => {
          if (img && img.startsWith("blob:")) {
            URL.revokeObjectURL(img);
          }
        });
      }
    };
  }, []);

  // API hooks
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();

  const isAuthenticated = !!currentUser;

  // 2. فلترة المنتجات بناءً على الفلاتر
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesCategory = filterCategory
      ? product.categoryId === parseInt(filterCategory)
      : true;
    const matchesBestSeller =
      filterBestSeller === "yes"
        ? product.bestSeller
        : filterBestSeller === "no"
        ? !product.bestSeller
        : true;
    return matchesName && matchesCategory && matchesBestSeller;
  });

  // 3. باجنيشن
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // simulate async
      if (
        loginForm.username.trim().toLowerCase() === "admin@admin.com" &&
        loginForm.password.trim() === "handball2024"
      ) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminLoggedIn", "true");
        window.dispatchEvent(new Event("storage"));
        setLoginError("");
        setLoading(false);
        // تحويل مباشر للوحة الأدمن
        window.location.href = "/admin";
      } else {
        setLoginError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLoginForm({ username: "", password: "" });
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  const resetForm = () => {
    // تنظيف URLs المحلية لتجنب تسرب الذاكرة
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img) => {
        if (img && img.startsWith("blob:")) {
          URL.revokeObjectURL(img);
        }
      });
    }

    setFormData({
      name: "",
      price: "",
      images: [""],
      description: "",
      address: "",
      country: "",
      categoryId: "", // <-- استخدم categoryId بدلاً من category
      bestSeller: false,
    });
    setFormErrors({}); // Reset form errors
  };

  // 2. تحقق عند الإرسال
  const handleAddProduct = (e) => {
    e.preventDefault();
    let errors = {};
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // تحضير البيانات بالشكل المتوقع من السيرفر
    const productData = {
      id: 0,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      soldCount: 0,
      productInformation: formData.description || "",
      address: formData.address || "",
      countryOfOrigin: formData.country || "",
      categoryId: parseInt(formData.categoryId),
      images: formData.images.filter(
        (img) => img && img.trim() !== "" && !img.startsWith("blob:")
      ),
      bestSeller: formData.bestSeller,
    };

    createProductMutation.mutate(productData, {
      onSuccess: (data) => {
        setShowAddModal(false);
        resetForm();

        if (data.isLocal) {
          toast.info("Product added locally!");
        } else {
          toast.success("Product added successfully!");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add product.");
      },
    });
  };

  // دالة مساعدة لتحويل اسم الكاتجوري إلى ID
  const getCategoryId = (categoryName) => {
    const categoryMap = {
      Basic: 1,
      Pro: 2,
      Elite: 3,
      Youth: 4,
    };
    return categoryMap[categoryName] || 1;
  };

  const handleEditProduct = (e) => {
    e.preventDefault();

    // تحضير البيانات بالشكل المتوقع من السيرفر
    const productData = {
      id: selectedProduct.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      soldCount: selectedProduct.soldCount || 0,
      productInformation: formData.description || "",
      address: formData.address || "",
      countryOfOrigin: formData.country || "",
      categoryId: parseInt(formData.categoryId),
      images: formData.images.filter(
        (img) => img && img.trim() !== "" && !img.startsWith("blob:")
      ),
      bestSeller: formData.bestSeller,
    };

    updateProductMutation.mutate(
      {
        id: selectedProduct.id,
        data: productData,
      },
      {
        onSuccess: (data) => {
          setShowEditModal(false);
          setSelectedProduct(null);
          resetForm();

          if (data.isLocal) {
            toast.info("Product updated locally!");
          } else {
            toast.success("Product updated successfully!");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update product.");
        },
      }
    );
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    Swal.fire({
      title: `Are you sure you want to delete the product "${product?.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation.mutate(productId);
        Swal.fire(
          "Deleted!",
          "The product has been deleted successfully.",
          "success"
        );
      }
    });
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);

    // تحويل categoryId إلى اسم الكاتجوري
    // const getCategoryName = (categoryId) => {
    //   const categoryMap = {
    //     1: "Basic",
    //     2: "Pro",
    //     3: "Elite",
    //     4: "Youth",
    //   };
    //   return categoryMap[categoryId] || "Basic";
    // };

    setFormData({
      name: product.name || "",
      price: product.price ? product.price.toString() : "",
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images.map((img) =>
              img.startsWith("/") ||
              img.startsWith("http") ||
              img.startsWith("data:") ||
              img.startsWith("blob:")
                ? img
                : `/images/${img.replace(/^.*[\\/]/, "")}`
            )
          : [""],
      description: product.description || "",
      address: product.address || "",
      country: product.countryOfOrigin || "",
      categoryId: product.categoryId || "",
      bestSeller: product.bestSeller || false,
    });
    setShowEditModal(true);
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const updateImageField = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const removeImageField = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // استبدل دالة رفع الصور القديمة بالجديدة لدعم رفع عدة صور
  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // محاولة رفع الصور إلى السيرفر
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const imageUrl = await productService.uploadProductImage(file);
        uploadedUrls.push(imageUrl);
      }
      // استبدل الصور المؤقتة بالنهائية (لا تكرر الصور)
      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []).filter((img) => !img.startsWith("blob:")),
          ...uploadedUrls,
        ],
      }));
      toast({
        title: "تم رفع الصور بنجاح!",
        description: "تم رفع صور المنتج.",
      });
    } catch (err) {
      toast({
        title: "تحذير",
        description: "تم حفظ الصور محلياً. قد لا تظهر في الإنتاج.",
        variant: "default",
      });
    }
  };

  // إذا لم يكن الأدمن مسجل دخول تظهر فورم تسجيل الدخول
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col md:flex-row items-center md:items-stretch mx-auto max-w-3xl w-full">
          {/* Left Section: Welcome */}
          <div className="hidden md:flex flex-col justify-center items-center w-[400px] bg-gradient-to-br from-pink-600 to-pink-400 rounded-l-3xl rounded-r-none p-12 text-white">
            <img
              src={logo}
              alt="Logo"
              className="w-32 h-32 object-contain mb-6 drop-shadow-xl"
            />
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
              Welcome Admin
            </h2>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
              Terboo Store
            </h1>
            <p className="text-lg opacity-80 text-center max-w-xs">
              Manage your store and products from here!
            </p>
          </div>
          {/* Right Section: Admin Login Form */}
          <div className="flex-1 flex items-center justify-center bg-white rounded-r-3xl rounded-l-none shadow-xl p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="text-center mb-8 md:hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-20 h-20 object-contain mb-2 mx-auto"
                />
                <h2 className="text-2xl font-extrabold mb-1 tracking-tight text-blue-700">
                  Welcome Admin
                </h2>
              </div>
              <h2 className="text-3xl font-extrabold text-pink-600 tracking-tight uppercase mb-2 text-center">
                Admin Login
              </h2>
              <p className="text-gray-500 mt-2 text-base text-center mb-6">
                Access the admin dashboard
              </p>
              {loginError && (
                <div className="mb-6 flex items-center gap-2 justify-center bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 font-semibold text-base shadow">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                  <span>{loginError}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full px-5 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-all bg-white font-bold text-gray-900 shadow-md hover:border-pink-200 focus:shadow-lg outline-none"
                    placeholder="admin@admin.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-all bg-white font-bold text-gray-900 shadow-md hover:border-pink-200 focus:shadow-lg outline-none pr-12"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m1.75-2.425A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-1.75 2.425A9.956 9.956 0 0112 21c-1.657 0-3.22-.402-4.575-1.125m-2.425-1.75A9.956 9.956 0 013 12c0-1.657.402-3.22 1.125-4.575"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.642 1.67-1.104 2.425"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-blue-700 text-white py-3 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  )}
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا كان الأدمن مسجل دخول تظهر لوحة الأدمن مباشرة
  return (
    <div className="min-h-screen bg-white py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Manage your handball shoe inventory and categories
            </p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md border border-red-700 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap md:flex-nowrap space-x-1 bg-gray-100 p-1 rounded-lg mb-6 md:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md font-medium transition-colors text-xs md:text-sm whitespace-nowrap ${
              activeTab === "products"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab("most-requested")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md font-medium transition-colors text-xs md:text-sm whitespace-nowrap ${
              activeTab === "most-requested"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            <span>Most Requested</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md font-medium transition-colors text-xs md:text-sm whitespace-nowrap ${
              activeTab === "categories"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Tag className="w-3 h-3 md:w-4 md:h-4" />
            <span>Categories</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "products" ? (
          <>
            {/* Add Product Button */}
            <div className="mb-4 md:mb-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-700 to-orange-500 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* شريط الفلترة */}
            <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-start md:items-center mb-6 bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white text-sm"
              />
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={filterBestSeller}
                onChange={(e) => {
                  setFilterBestSeller(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white text-sm"
              >
                <option value="">All Products</option>
                <option value="yes">Best Seller Only</option>
                <option value="no">Not Best Seller</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <table className="w-full text-xs md:text-sm lg:text-base">
                <thead className="bg-gray-100/30">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[100px] md:min-w-[120px]">
                      Product
                    </th>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px]">
                      Price
                    </th>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                      Best Seller
                    </th>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px]">
                      Requests
                    </th>
                    <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px] hidden md:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => [
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setOpenActionsId(
                            openActionsId === product.id ? null : product.id
                          );
                        }
                      }}
                    >
                      <td className="p-2 md:p-4 min-w-[100px] md:min-w-[120px]">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <img
                            src={getCleanImageUrl(
                              Array.isArray(product.images)
                                ? product.images[0]
                                : product.image ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                            )}
                            alt={product.name}
                            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-xs md:text-sm lg:text-base truncate">
                              {product.name}
                            </div>
                            {/* Hide country on mobile */}
                            <div className="text-xs text-gray-500 hidden md:block">
                              {product.countryOfOrigin ||
                                product.country ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 font-semibold text-purple-700 min-w-[60px] md:min-w-[90px] text-xs md:text-sm">
                        {product.price} EGP
                      </td>
                      <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {getCategoryName(product.categoryId) || "N/A"}
                        </span>
                      </td>
                      <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            product.bestSeller
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.bestSeller ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px]">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {product.purchaseCount || 0}
                        </span>
                      </td>
                      {/* أزرار التعديل والحذف على الديسكتوب فقط */}
                      <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px] hidden md:table-cell">
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(product);
                            }}
                            className="w-full md:w-auto p-1 md:p-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                          >
                            <Edit className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            className="w-full md:w-auto p-1 md:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>,
                    // صف الأزرار يظهر فقط على الموبايل إذا كان هذا المنتج هو المفتوح
                    openActionsId === product.id && (
                      <tr key={product.id + "-actions"} className="md:hidden">
                        <td colSpan={5} className="py-2">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(product);
                              }}
                              className="flex items-center gap-1 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-semibold"
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  ])}
                </tbody>
              </table>
            </div>
            {/* باجنيشن أسفل الجدول */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : activeTab === "most-requested" ? (
          <>
            {/* Most Requested Products Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Most Requested Products
              </h2>
              <p className="text-gray-600">
                Products that have been clicked "Buy Now" the most
              </p>
            </div>

            {/* Most Requested Products Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              {isLoadingMostRequested ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : mostRequestedProducts && mostRequestedProducts.length > 0 ? (
                <table className="w-full text-xs md:text-sm lg:text-base">
                  <thead className="bg-gray-100/30">
                    <tr>
                      <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[100px] md:min-w-[120px]">
                        Product
                      </th>
                      <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px]">
                        Price
                      </th>
                      <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px]">
                        Requests
                      </th>
                      <th className="text-left p-2 md:p-4 font-semibold text-gray-900 min-w-[60px] md:min-w-[90px]">
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostRequestedProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <td className="p-2 md:p-4 min-w-[100px] md:min-w-[120px]">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <img
                              src={getCleanImageUrl(
                                Array.isArray(product.images)
                                  ? product.images[0]
                                  : product.image ||
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                              )}
                              alt={product.name}
                              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-xs md:text-sm lg:text-base truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 hidden md:block">
                                {product.countryOfOrigin ||
                                  product.country ||
                                  "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 md:p-4 font-semibold text-purple-700 min-w-[60px] md:min-w-[90px] text-xs md:text-sm">
                          {product.price} EGP
                        </td>
                        <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px] hidden sm:table-cell">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {getCategoryName(product.categoryId) || "N/A"}
                          </span>
                        </td>
                        <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px]">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                            {product.purchaseCount || 0}
                          </span>
                        </td>
                        <td className="p-2 md:p-4 min-w-[60px] md:min-w-[90px]">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <Star className="w-12 h-12 mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">
                    No requested products yet
                  </h3>
                  <p className="text-sm text-center">
                    When users click "Buy Now", products will appear here
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <CategoryManagement />
        )}

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {showAddModal ? "Add New Product" : "Edit Product"}
                  </h2>

                  <form
                    onSubmit={
                      showAddModal ? handleAddProduct : handleEditProduct
                    }
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-colors bg-white"
                          placeholder="Product Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Price (EGP)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-colors bg-white"
                          placeholder="Price"
                        />
                      </div>
                    </div>

                    {/* صورة المنتج */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Product Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProductImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {formData.images &&
                        formData.images.filter(
                          (img) => img && img.trim() !== ""
                        ).length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {formData.images
                              .filter((img) => img && img.trim() !== "")
                              .map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={getCleanImageUrl(img)}
                                    alt={`Product ${idx + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        images: prev.images.filter(
                                          (_, i) => i !== idx
                                        ),
                                      }));
                                    }}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                                    title="Remove"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-colors bg-white resize-none"
                        placeholder="Description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-colors bg-white"
                          placeholder="Address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-colors bg-white"
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.categoryId || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              categoryId: parseInt(e.target.value),
                            }))
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-700 transition-colors bg-white ${
                            formErrors.categoryId
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.categoryId}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-8">
                        <input
                          type="checkbox"
                          id="bestSeller"
                          checked={formData.bestSeller}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bestSeller: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-purple-700 border-gray-200 rounded focus:ring-purple-700"
                        />
                        <label
                          htmlFor="bestSeller"
                          className="text-sm font-medium text-gray-900"
                        >
                          Best Seller
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-700 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                      >
                        {showAddModal ? "Add Product" : "Update Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
