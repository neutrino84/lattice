
export default class Pool<T> {
  private pool = new Map<string, T[]>()

  public checkin(key: string, component: T): void {
    let pool = this.pool
    let collection = pool.get(key)
    if (collection == undefined) {
      pool.set(key, [component])
    } else {
      collection.push(component)
    }
  }

  public checkout(key: string): T | undefined {
    let pool = this.pool
    let collection = pool.get(key)
    return collection && collection.pop()
  }
}