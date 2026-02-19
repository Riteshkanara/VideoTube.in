export function optimizeCloudinaryUrl(url, width = 640) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const httpsUrl = url.replace(/^http:\/\//, 'https://');
  return httpsUrl.replace('/upload/', `/upload/f_webp,q_auto,w_${width}/`);
}