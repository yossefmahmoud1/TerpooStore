import React, { useState } from "react";
import { imageService } from "../services/imageService";
import { Image, ImageOff } from "lucide-react";

const ImageDisplay = ({
  src,
  alt = "صورة",
  className = "",
  fallbackText = "صورة غير متوفرة",
  width = 300,
  height = 200,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const getImageUrl = () => {
    if (!src || imageError) {
      return imageService.createPlaceholder(width, height, fallbackText);
    }
    return imageService.getImageUrl(src);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {imageError ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded p-4">
          <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 text-center">
            {fallbackText}
          </span>
        </div>
      ) : (
        <img
          src={getImageUrl()}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover rounded ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default ImageDisplay;
