/**
 * Constructs full image URL from relative paths
 * Handles both relative and absolute URLs
 * Works with backend serving files from /uploads directory
 */
export const getFullImageUrl = (filePath) => {
  if (!filePath) return "";
  
  // If already a full URL, return as-is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  
  // Get base URL - use window.location.origin to get the current domain
  // Then construct the backend URL based on the running environment
  let baseUrl;
  
  if (process.env.REACT_APP_API_BASE_URL) {
    baseUrl = process.env.REACT_APP_API_BASE_URL;
  } else if (process.env.NODE_ENV === "production") {
    // In production, use the BACKEND_URL from .env or current origin
    baseUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin.replace(":3000", ":3001");
  } else {
    // In development, construct backend URL from current location
    // If frontend is on localhost:3000, backend should be localhost:3001
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    baseUrl = `${protocol}//${hostname}:3001`;
  }
  
  // Ensure filePath starts with /
  const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  
  console.log("[v0] getFullImageUrl - filePath:", filePath, "baseUrl:", baseUrl, "final:", `${baseUrl}${cleanPath}`);
  
  return `${baseUrl}${cleanPath}`;
};
