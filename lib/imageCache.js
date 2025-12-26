/**
 * Image Cache Utility
 * Manages localStorage caching for profile images
 */

const CACHE_PREFIX = 'linkpeak_img_';
const CACHE_VERSION = 'v1';

/**
 * Generate cache key for an image
 */
export function getCacheKey(userId, hash) {
    return `${CACHE_PREFIX}${CACHE_VERSION}_${userId}_${hash}`;
}

/**
 * Get cached image from localStorage
 * @param {string} userId - User ID
 * @param {string} hash - Image hash for validation
 * @returns {string|null} - Base64 data URI or null if not cached
 */
export function getCachedImage(userId, hash) {
    if (typeof window === 'undefined') return null;

    try {
        const key = getCacheKey(userId, hash);
        const cached = localStorage.getItem(key);

        if (cached) {
            // Verify it's a valid data URI
            if (cached.startsWith('data:image/')) {
                return cached;
            }
        }
        return null;
    } catch (error) {
        console.warn('Cache read error:', error);
        return null;
    }
}

/**
 * Store image in localStorage cache
 * @param {string} userId - User ID
 * @param {string} hash - Image hash
 * @param {string} dataURI - Base64 data URI
 */
export function setCachedImage(userId, hash, dataURI) {
    if (typeof window === 'undefined') return;

    try {
        const key = getCacheKey(userId, hash);
        localStorage.setItem(key, dataURI);
    } catch (error) {
        // localStorage quota exceeded or disabled
        console.warn('Cache write error:', error);
        // Try to clear old cache entries
        clearOldCache();
    }
}

/**
 * Invalidate all cached images for a user
 * @param {string} userId - User ID
 */
export function invalidateUserCache(userId) {
    if (typeof window === 'undefined') return;

    try {
        const keys = Object.keys(localStorage);
        const userPrefix = `${CACHE_PREFIX}${CACHE_VERSION}_${userId}_`;

        keys.forEach(key => {
            if (key.startsWith(userPrefix)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.warn('Cache invalidation error:', error);
    }
}

/**
 * Clear old cache entries (from previous versions or old images)
 */
export function clearOldCache() {
    if (typeof window === 'undefined') return;

    try {
        const keys = Object.keys(localStorage);
        const currentPrefix = `${CACHE_PREFIX}${CACHE_VERSION}_`;

        keys.forEach(key => {
            // Remove old version caches
            if (key.startsWith(CACHE_PREFIX) && !key.startsWith(currentPrefix)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.warn('Cache cleanup error:', error);
    }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    if (typeof window === 'undefined') return { count: 0, size: 0 };

    try {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));

        let totalSize = 0;
        cacheKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                totalSize += value.length;
            }
        });

        return {
            count: cacheKeys.length,
            size: totalSize,
            sizeKB: (totalSize / 1024).toFixed(2)
        };
    } catch (error) {
        return { count: 0, size: 0 };
    }
}
