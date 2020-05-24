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

  /*
   * Module lifecyle methods
   */
  init(modules: ModuleClass<Module>[]): void {
    // instantiate modules
    modules.forEach(Module => this.add(Module))

    // initialize instantiated modules
    this.modules.forEach(module => {
      module.init()
    })

    // mount modules
    this.modules.forEach(module => {
      module.mount()
    })

    // run mounted logic
    this.modules.forEach(module => {
      module.mounted()
    })
  }

  add(Module: ModuleClass<Module>): void {
    this.modules.set(Module.name, new Module(this.core))
  }

  get<T extends Module>(name: string): T | undefined {
    return this.modules.get(name) as T
  }

  destroy(): void {
    delete this.core
    delete this.modules
  }
}