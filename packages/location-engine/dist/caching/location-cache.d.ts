export declare class LocationCache<T> {
    private cache;
    private ttlMs;
    private maxEntries;
    constructor(ttlMs?: number, maxEntries?: number);
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    clear(): void;
}
//# sourceMappingURL=location-cache.d.ts.map