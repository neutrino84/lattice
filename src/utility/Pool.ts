
export default class Pool<T> {
  private pool = new Map<string, T[]>()

  public clear(): void {
    this.pool = new Map<string, T[]>()
  }

  public release(key: string, component: T): void {
    let pool = this.pool
    let collection = pool.get(key)
    if (collection == undefined) {
      pool.set(key, [component])
    } else {
      collection.push(component)
    }
  }

  public acquire(key: string): T | undefined {
    let pool = this.pool
    let collection = pool.get(key)
    return collection && collection.pop()
  }
}