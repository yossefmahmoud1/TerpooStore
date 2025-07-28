import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategories";
import { ClipLoader } from "react-spinners";
import OptimizedImage from "./OptimizedImage";
import categoryService from "../services/categoryService";
import { getFullImageUrl } from "../utils/imageUtils";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Utility to get the full image URL
function getCleanImageUrl(img) {
  if (!img) return "";
  const fileName = img.split("/").pop().trim();
  return `http://terpoostore.runasp.net/images/${fileName}`;
}

const CategoryManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  // API hooks
  const { data: categories = [], isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();

    // تحضير البيانات بالشكل المتوقع من السيرفر
    const categoryData = {
      id: 0,
      name: formData.name,
      description: formData.description,
      image: formData.image || "",
    };

    createCategoryMutation.mutate(categoryData, {
      onSuccess: () => {
        setShowAddModal(false);
        resetForm();
        toast.success("Category added successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add category.");
      },
    });
  };

  const handleEditCategory = (e) => {
    e.preventDefault();

    // تحضير البيانات بالشكل المتوقع من السيرفر
    const categoryData = {
      id: selectedCategory.id,
      name: formData.name,
      description: formData.description,
      image: formData.image || "",
    };

    updateCategoryMutation.mutate(
      {
        id: selectedCategory.id,
        data: categoryData,
      },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setSelectedCategory(null);
          resetForm();
          toast.success("Category updated successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update category.");
        },
      }
    );
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete the category "${category?.name}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategoryMutation.mutate(categoryId);
      }
    });
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload for category
  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageUrl = await categoryService.uploadCategoryImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (err) {
      toast.error("Failed to upload category image.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <ClipLoader size={50} color="#7c3aed" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Error loading categories
        </h3>
        <p className="text-gray-500 mb-6">
          {error.message || "Failed to load categories. Please try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Category Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage product categories for your store
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Category Image */}
            <div className="h-48 bg-gray-100 relative">
              {(() => {
                // داخل كارت الكاتيجوري، استبدل منطق الصورة:
                const validImage =
                  Array.isArray(category.images) && category.images.length > 0
                    ? category.images[0]
                    : category.image &&
                      category.image !== "string" &&
                      category.image.trim() !== "" &&
                      category.image.trim().toLowerCase() !== "null" &&
                      category.image.trim().toLowerCase() !== "undefined"
                    ? category.image
                    : null;
                if (validImage) {
                  return (
                    <img
                      src={getCleanImageUrl(validImage)}
                      alt={category.name}
                      style={{
                        width: 400,
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 12,
                        boxShadow: "0 2px 12px 0 #e5e7eb",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23f3f4f6'/%3E%3Ctext x='100' y='50' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  );
                } else {
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
                        />
                      </svg>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">ID: {category.id}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add New Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Category description"
                  />
                </div>
                {/* صورة التصنيف */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCategoryImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData.image && formData.image !== "string" && (
                    <img
                      src={getCleanImageUrl(formData.image)}
                      alt="Category"
                      className="mt-2 w-24 h-24 object-cover rounded-lg border"
                    />
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {createCategoryMutation.isPending ? (
                      <ClipLoader size={16} color="white" />
                    ) : (
                      "Add Category"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Category
              </h3>
              <form onSubmit={handleEditCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Category description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {/* صورة التصنيف */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCategoryImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData.image && (
                    <img
                      src={getCleanImageUrl(formData.image)}
                      alt="Category"
                      className="mt-2 w-24 h-24 object-cover rounded-lg border"
                    />
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateCategoryMutation.isPending}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {updateCategoryMutation.isPending ? (
                      <ClipLoader size={16} color="white" />
                    ) : (
                      "Update Category"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
