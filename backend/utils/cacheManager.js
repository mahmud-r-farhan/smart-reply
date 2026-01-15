import crypto from "crypto";

// Simple in-memory cache with TTL
class CacheManager {
  constructor(ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  /**
   * Generate cache key from prompt and model
   * Uses SHA256 hash for uniqueness
   */
  generateKey(prompt, model) {
    const hash = crypto
      .createHash("sha256")
      .update(prompt + model)
      .digest("hex");
    return hash;
  }

  /**
   * Set cache entry with TTL
   */
  set(key, value) {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttlMs
    });
  }

  /**
   * Get cache entry if not expired
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expires > Date.now()) {
      return entry.value;
    }

    // Expired, delete it
    this.cache.delete(key);
    return null;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [, entry] of this.cache) {
      if (entry.expires > now) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries
    };
  }
}

export default new CacheManager(5 * 60 * 1000); // 5 minute TTL
