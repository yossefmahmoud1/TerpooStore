// Fallback data for when API is not available
export const fallbackProducts = [];

export const fallbackAdminCredentials = {
  username: "admin",
  password: "handball2024",
};

// Fallback service functions
export const fallbackProductService = {
  getAllProducts: async () => [],
  getProductById: async (id) => {
    throw new Error("Product not found");
  },
  getBestSellers: async () => [],
  getProductsByCategory: async (category) => [],
  searchProducts: async (searchTerm) => [],
  createProduct: async (productData) => {
    throw new Error("API not available");
  },
  updateProduct: async (id, productData) => {
    throw new Error("API not available");
  },
  deleteProduct: async (id) => {
    throw new Error("API not available");
  },
};

export const fallbackAuthService = {
  adminLogin: async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (
      credentials.username === fallbackAdminCredentials.username &&
      credentials.password === fallbackAdminCredentials.password
    ) {
      return {
        token: "fallback-token-123",
        user: { username: credentials.username },
      };
    }
    throw new Error("Invalid credentials");
  },

  adminLogout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { message: "Logged out successfully" };
  },

  verifyToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { valid: true };
  },

  getCurrentUser: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { username: fallbackAdminCredentials.username };
  },
};

// Fallback category data
export const fallbackCategories = [
  {
    id: 1,
    name: "Shoes",
    description: "Professional handball shoes for all levels",
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Clothing",
    description: "Handball clothing and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Handballs",
    description: "Professional handballs for training and matches",
    imageUrl:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Gear",
    description: "Protective gear and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Fallback category service functions
export const fallbackCategoryService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return fallbackCategories;
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const category = fallbackCategories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    return category;
  },

  create: async (categoryData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCategory = {
      ...categoryData,
      id: Math.max(...fallbackCategories.map((c) => c.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    fallbackCategories.push(newCategory);
    return newCategory;
  },

  update: async (id, categoryData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = fallbackCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    fallbackCategories[index] = {
      ...fallbackCategories[index],
      ...categoryData,
      id,
    };
    return fallbackCategories[index];
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = fallbackCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    const deletedCategory = fallbackCategories[index];
    fallbackCategories.splice(index, 1);
    return deletedCategory;
  },
};
