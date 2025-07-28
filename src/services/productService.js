import api from "./api";
import { fallbackProductService } from "./fallbackData";

// Product API endpoints
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get("/Products");
      const serverProducts = response.data;

      // جلب المنتجات المحلية
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );

      // دمج المنتجات من السيرفر والمحلية
      const allProducts = [...serverProducts, ...localProducts];

      return allProducts;
    } catch (error) {
      // إذا فشل API، استخدم المنتجات المحلية فقط
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      return localProducts;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/Products/${id}`);
      return response.data;
    } catch (error) {
      return fallbackProductService.getProductById(id);
    }
  },

  // Get best sellers
  getBestSellers: async () => {
    try {
      const response = await api.get("/Products/most-selling");
      return response.data;
    } catch (error) {
      return fallbackProductService.getBestSellers();
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/Products/category/${category}`);
      return response.data;
    } catch (error) {
      return fallbackProductService.getProductsByCategory(category);
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    try {
      const response = await api.get(
        `/Products/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      return fallbackProductService.searchProducts(searchTerm);
    }
  },

  // Create new product (admin only)
  createProduct: async (productData) => {
    try {
      const response = await api.post("/Products", productData);
      return response.data;
    } catch (error) {
      // إذا فشل API، استخدم fallback mode
      const fallbackProduct = {
        id: Date.now(),
        name: productData.name?.trim() || "",
        description: productData.description?.trim() || "",
        price: parseFloat(productData.price) || 0,
        soldCount: 0,
        productInformation:
          productData.productInformation?.trim() ||
          productData.description?.trim() ||
          "",
        address: productData.address?.trim() || "",
        countryOfOrigin: productData.countryOfOrigin?.trim() || "",
        categoryId: parseInt(productData.categoryId) || 1,
        category: null,
        images: Array.isArray(productData.images) ? productData.images : [],
        isLocal: true,
      };

      // حفظ المنتج المحلي في localStorage
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      localProducts.push(fallbackProduct);
      localStorage.setItem("localProducts", JSON.stringify(localProducts));
      return fallbackProduct;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/Products/${id}`, productData);
      return response.data;
    } catch (error) {
      // إذا فشل API، استخدم fallback mode for update
      const fallbackProduct = {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        soldCount: productData.soldCount || 0,
        productInformation:
          productData.productInformation || productData.description,
        address: productData.address || "",
        countryOfOrigin: productData.countryOfOrigin || "",
        categoryId: productData.categoryId,
        category: null,
        images: productData.images || [],
        isLocal: true,
      };

      // تحديث المنتج المحلي في localStorage
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      const index = localProducts.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        localProducts[index] = fallbackProduct;
      } else {
        localProducts.push(fallbackProduct);
      }
      localStorage.setItem("localProducts", JSON.stringify(localProducts));
      return fallbackProduct;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/Products/${id}`);
      return response.data;
    } catch (error) {
      // إذا فشل API، احذف من المنتجات المحلية
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      const filteredProducts = localProducts.filter((p) => p.id !== id);
      localStorage.setItem("localProducts", JSON.stringify(filteredProducts));
      return { success: true, message: "Product deleted locally" };
    }
  },

  // Upload product images
  uploadImages: async (formData) => {
    try {
      const response = await api.post("/Products/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Image upload not available in fallback mode");
    }
  },

  // Upload product image
  uploadProductImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/Products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl || response.data.url || response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    }
  },

  // Increment purchase count for a product
  incrementPurchaseCount: async (productId) => {
    try {
      const response = await api.post(
        `/Products/${productId}/increment-purchase`
      );
      return response.data;
    } catch (error) {
      // إذا فشل API، استخدم fallback mode
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      const productIndex = localProducts.findIndex((p) => p.id === productId);

      if (productIndex !== -1) {
        localProducts[productIndex].purchaseCount =
          (localProducts[productIndex].purchaseCount || 0) + 1;
        localStorage.setItem("localProducts", JSON.stringify(localProducts));
        return localProducts[productIndex];
      }

      throw new Error("Product not found");
    }
  },

  // Get most requested products
  getMostRequestedProducts: async () => {
    try {
      const response = await api.get("/Products/most-requested");
      return response.data;
    } catch (error) {
      // إذا فشل API، استخدم المنتجات المحلية
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );

      // ترتيب المنتجات حسب عدد المشتريات
      const sortedProducts = localProducts
        .filter((product) => (product.purchaseCount || 0) > 0)
        .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
        .slice(0, 10); // أعلى 10 منتجات

      return sortedProducts;
    }
  },
};
