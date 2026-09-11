export class LocationCache {
    cache = new Map();
    ttlMs;
    maxEntries;
    constructor(ttlMs = 3600000, maxEntries = 200) {
        this.ttlMs = ttlMs;
        this.maxEntries = maxEntries;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        if (Date.now() - entry.timestamp > this.ttlMs) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value) {
        if (this.cache.size >= this.maxEntries) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey)
                this.cache.delete(oldestKey);
        }
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
        });
    }
    clear() {
        this.cache.clear();
    }
}
//# sourceMappingURL=location-cache.js.map