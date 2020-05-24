import Core from '.'
import Module from './modules/Module'

export interface ModuleClass<T> extends Function {
  new (core: Core): T
}

export default class ModuleRegistry {
  private core: Core
  private modules = new Map<string, Module>()

  constructor(core: Core) {
    this.core = core
  }

  init(modules: ModuleClass<Module>[]): void {
    // instantiate modules
    modules.forEach(Module => this.add(Module))

    // initialize instantiated modules
    this.modules.forEach(module => {
      module.init()
    })
  }

  add(Module: ModuleClass<Module>): void {
    this.modules.set(Module.name, new Module(this.core))
  }

  get(name: string): Module | undefined {
    return this.modules.get(name)
  }

  destroy(): void {
    delete this.core
    delete this.modules
  }
}