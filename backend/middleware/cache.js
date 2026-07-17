// backend/middleware/cache.js

/**
 * Simple in‑memory response cache middleware.
 * Usage: `router.get('/endpoint', cache(60), controllerFn);`
 * The middleware stores the JSON response for `duration` seconds.
 * It works for GET requests and returns the cached JSON directly.
 */
function cache(durationSeconds) {
  const cacheStore = new Map(); // key -> { expire: timestamp, data: responseBody }

  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    const key = `__express__${req.originalUrl || req.url}`;
    const cached = cacheStore.get(key);
    const now = Date.now();
    if (cached && cached.expire > now) {
      // Return cached JSON response
      return res.json(cached.data);
    }
    // Replace res.json to capture the body
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      cacheStore.set(key, { expire: now + durationSeconds * 1000, data: body });
      return originalJson(body);
    };
    next();
  };
}

module.exports = cache;
