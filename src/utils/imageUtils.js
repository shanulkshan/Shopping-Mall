import { API_BASE_URL } from './api.js';

// Utility function to get the correct image URL
export const getImageUrl = (imagePath, fallbackSvg = null) => {
  if (!imagePath) {
    return fallbackSvg || getDefaultShopLogo();
  }
  
  // If it's already a full URL (data: or http:), return as is
  if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a filename, construct the URL to the uploaded file
  // In production, API_BASE_URL is empty, so we use relative URLs
  // In development, API_BASE_URL is 'http://localhost:3000'
  if (API_BASE_URL) {
    return `${API_BASE_URL}/uploads/shop-logos/${imagePath}`;
  } else {
    // Production: use relative URL
    return `/uploads/shop-logos/${imagePath}`;
  }
};

// Default shop logo SVG
export const getDefaultShopLogo = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNjBDODAgNjAgMjAgMTAwIDIwIDEwMFM4MCAxNDAgMTUwIDE0MFMyODAgMTAwIDI4MCAxMDBTMjIwIDYwIDE1MCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAxMjBDMTYyLjQyNiAxMjAgMTcyLjUgMTA5LjkyNiAxNzIuNSA5Ny41QzE3Mi41IDg1LjA3NCAxNjIuNDI2IDc1IDE1MCA3NUMxMzcuNTc0IDc1IDEyNy41IDg1LjA3NCAxMjcuNSA5Ny41QzEyNy41IDEwOS45MjYgMTM3LjU3NCAxMjAgMTUwIDEyMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaG9wPC90ZXh0Pgo8L3N2Zz4K';
};
