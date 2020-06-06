import Rectangle from "../../geometry/Rectangle"

export default abstract class Node {
  public parent: Node | null
  public previous: Node | null
  public next: Node | null
  public children: Node[] = []
  public bounds: Rectangle = new Rectangle()

  constructor() {
    this.parent = null
    this.previous = null
    this.next = null
  }

  add(node: Node): void {}
  remove(): void {}
  removeAll(): void {}
  destroy(): void {}
}