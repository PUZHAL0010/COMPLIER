import LZString from 'lz-string';

/**
 * Encode Code snippet to compressed URL hash string
 */
export function encodeCodeToUrl(html = '', css = '', js = '') {
  try {
    const payload = JSON.stringify({ html, css, js });
    const compressed = LZString.compressToEncodedURIComponent(payload);
    return `#code/${compressed}`;
  } catch (err) {
    console.error('Failed to encode code snippet to URL:', err);
    return '';
  }
}

/**
 * Decode Code snippet from URL hash string
 */
export function decodeCodeFromUrl(hash = '') {
  if (!hash || !hash.startsWith('#code/')) return null;

  try {
    const compressed = hash.replace('#code/', '');
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch (err) {
    console.error('Failed to decode code snippet from URL hash:', err);
    return null;
  }
}
