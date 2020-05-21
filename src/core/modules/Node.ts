export default abstract class Node {
  parent: Node | undefined
  children: Node[] = []

  constructor() {
    //..
  }

  add(node: Node): void {}
  remove(): void {}
  removeAll(): void {}
  destroy(): void {}
}