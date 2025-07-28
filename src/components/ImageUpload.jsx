import React, { useState, useRef } from "react";
import { imageService } from "../services/imageService";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

const ImageUpload = ({
  onImagesChange,
  multiple = false,
  maxFiles = 5,
  className = "",
  ...props
}) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    setError("");

    if (files.length === 0) return;

    // Validate number of files
    if (!multiple && files.length > 1) {
      setError("يمكن اختيار صورة واحدة فقط");
      return;
    }

    if (multiple && files.length > maxFiles) {
      setError(`يمكن اختيار ${maxFiles} صور كحد أقصى`);
      return;
    }

    // Validate each file
    for (const file of files) {
      try {
        imageService.validateImage(file);
      } catch (validationError) {
        setError(validationError.message);
        return;
      }
    }

    setIsUploading(true);

    try {
      // Create preview URLs
      const previews = await Promise.all(
        files.map((file) => imageService.fileToBase64(file))
      );

      if (multiple) {
        setPreviewImages((prev) => [...prev, ...previews]);
        onImagesChange([...previewImages, ...previews]);
      } else {
        setPreviewImages([previews[0]]);
        onImagesChange([previews[0]]);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setError("حدث خطأ أثناء معالجة الصور");
    } finally {
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    onImagesChange(newImages);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      const fakeEvent = { target: { files } };
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className={className} {...props}>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-3 p-2 bg-red-50 rounded">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-blue-400 ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}

          <div>
            <p className="text-sm text-gray-600">
              {isUploading
                ? "جاري رفع الصور..."
                : "اسحب الصور هنا أو اضغط للاختيار"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple
                ? `يمكن رفع ${maxFiles} صور كحد أقصى`
                : "صورة واحدة فقط"}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Images */}
      {previewImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            الصور المختارة:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
