import Rectangle from "../../geometry/Rectangle"

export default abstract class Node {
  public parent: Node | undefined
  public previous: Node | undefined
  public next: Node | undefined
  public children: Node[] = []
  public bounds: Rectangle = new Rectangle()

  constructor() {
    //..
  }

  add(node: Node): void {}
  remove(): void {}
  removeAll(): void {}
  destroy(): void {}
}