import api from "./api";

// Category API endpoints
const BASE_URL = "/Categories";

export const categoryService = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch category"
      );
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const cleanCategoryData = {
        id: 0,
        name: categoryData.name?.trim() || "",
        description: categoryData.description?.trim() || "",
        image: categoryData.image || "",
      };
      console.log("Creating category with data:", cleanCategoryData);
      const response = await api.post(BASE_URL, cleanCategoryData);
      console.log("Category created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      console.error("Error response:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create category"
      );
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const cleanCategoryData = {
        id: categoryData.id || id,
        name: categoryData.name,
        description: categoryData.description || "",
        image: categoryData.image || "",
      };
      const response = await api.put(`${BASE_URL}/${id}`, cleanCategoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update category"
      );
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete category"
      );
    }
  },

  // Upload category image
  uploadCategoryImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`${BASE_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl || response.data.url || response.data;
    } catch (error) {
      console.error("Error uploading category image:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    }
  },

  // Upload multiple category images
  uploadCategoryImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await api.post(`${BASE_URL}/upload-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading category images:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload images"
      );
    }
  },
};

export default categoryService;
