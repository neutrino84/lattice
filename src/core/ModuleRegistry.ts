import Core from '.';
import Module from './modules/Module';

export default class ModuleRegistry {
  private core: Core
  private modules = new Map<string, Module>()

  constructor(core: Core) {
    this.core = core
  }

  init<T extends Module>(Module: { new(core: Core): T }): void {
    this.add(new Module(this.core))
  }

  add(module: Module): void {
    this.modules.set(module.name, module)
  }

  get(name: string): Module | undefined {
    return this.modules.get(name)
  }

  destroy(): void {
    delete this.core
    delete this.modules
  }
}