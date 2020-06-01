
/*
 * 
 */
export default class Cache<T> {
  private cache = new Map<string, T>()
  
  public has(key: string): boolean {
    return this.cache.has(key)
  }
  
  public get(key: string): T | undefined {
    return this.cache.get(key)
  }

  public set(key: string, value: T): void {
    this.cache.set(key, value)
  }

  public delete(key: string): void {
    this.cache.delete(key)
  }

  public clear(): void {
    this.cache.clear()
  }

  public destroy(): void {
    this.cache.clear()
  }
}