import api from "./api";

// Image service for handling image uploads and conversions
export const imageService = {
  // Convert file to base64
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  // Upload single image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/Products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      // Fallback: convert to base64
      const base64 = await imageService.fileToBase64(file);
      return base64;
    }
  },

  // Upload multiple images
  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await api.post("/Products/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrls || response.data;
    } catch (error) {
      // Fallback: convert all to base64
      const base64Images = await Promise.all(
        files.map((file) => imageService.fileToBase64(file))
      );
      return base64Images;
    }
  },

  // Validate image file
  validateImage: (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error(
        "نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG, PNG, GIF, أو WebP"
      );
    }

    if (file.size > maxSize) {
      throw new Error("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت");
    }

    return true;
  },

  // Get image URL with fallback
  getImageUrl: (imageUrl, fallbackUrl = null) => {
    if (!imageUrl) return fallbackUrl;

    // If it's already a base64 or data URL
    if (imageUrl.startsWith("data:") || imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a relative path, make it absolute
    if (imageUrl.startsWith("/")) {
      return `${window.location.origin}${imageUrl}`;
    }

    return imageUrl;
  },

  // Create placeholder image
  createPlaceholder: (width = 300, height = 200, text = "صورة") => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

    // Text
    ctx.fillStyle = "#6b7280";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toDataURL();
  },
};

export default imageService;
