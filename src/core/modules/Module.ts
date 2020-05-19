import Core from "..";

export default abstract class Module {
  core: Core
  name: string = ''

  constructor(core: Core) {
    this.core = core
  }

  init(): void {

  }

  destroy(): void {
    delete this.core
  }
}