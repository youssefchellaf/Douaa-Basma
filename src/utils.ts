export function getProxiedImageUrl(url: string | undefined): string {
  if (!url) return '';
  
  // Clean clean absolute or local paths
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // Proxy remote images, especially Google Drive and googleusercontent links,
  // to avoid strict cross-origin/referrer blocking on Safari, Firefox and other browsers.
  if (
    url.includes('googleusercontent.com') || 
    url.includes('drive.google.com') || 
    url.includes('lh3.google.com') ||
    url.startsWith('http')
  ) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}
