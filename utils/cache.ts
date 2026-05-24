type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache: { [key: string]: CacheEntry<unknown> } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const setCache = <T>(key: string, data: T): void => {
  cache[key] = { data, timestamp: Date.now() };
};

export const getCache = <T>(key: string): T | null => {
  const entry = cache[key] as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    delete cache[key];
    return null;
  }
  return entry.data;
};

export const clearCache = (key?: string): void => {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }
};
