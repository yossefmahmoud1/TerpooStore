// Utility to get the full image URL for products/categories
export function getFullImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (
    imageUrl.startsWith("http") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  )
    return imageUrl;
  // If it's a relative path (e.g. /images/xxx.jpg)
  return `https://terpoostore.runasp.net${imageUrl}`;
}
