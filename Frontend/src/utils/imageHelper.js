const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

/**
 * Safely resolves the image URL from backend paths.
 * Handles missing images, remote URLs, and Windows backslashes.
 * 
 * @param {string} imagePath - The path stored in DB (e.g. 'uploads/destinations/file.jpg' or 'uploads\\destinations\\file.jpg')
 * @param {string} placeholderType - e.g., 'destination', 'package', 'user'
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath, placeholderType = 'image') => {
  if (!imagePath) {
    return `https://via.placeholder.com/600x400?text=No+${placeholderType.toUpperCase()}+Image`;
  }

  // If it's already an absolute URL (like https://images.unsplash.com/...)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Replace Windows backslashes with forward slashes
  let cleanPath = imagePath.replace(/\\/g, '/');

  if (!cleanPath.includes('uploads/')) {
    const folder = placeholderType === 'destination' ? 'destinations' : 
                   placeholderType === 'package' ? 'packages' : 
                   placeholderType === 'user' ? 'users' : 'misc';
    cleanPath = `uploads/${folder}/${cleanPath}`;
  } else {
    // Ensure it doesn't have a leading slash if we're appending it
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
  }

  return `${API_BASE_URL}/${cleanPath}`;
};
