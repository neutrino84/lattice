import ModuleRegistry from './ModuleRegistry'
import GridManager from './modules/grid/GridManager'

export interface ColumnDefinition {
  name: string
  field: string
}

export interface GridOptions {
  element: HTMLElement | string
  definitions: ColumnDefinition[]
  data: any[]
}

export default class Core {
  options: GridOptions
  registry: ModuleRegistry
  root: HTMLElement | null

  constructor(options: GridOptions) {
    this.options = options

    if (typeof options.element === 'string') {
      this.root = document.getElementById(options.element)
    } else if (options.element instanceof HTMLElement) {
      this.root = options.element
    } else {
      this.root = null
    }
    if (this.root == null) {
      throw Error('Grid root must not be null')
    }

    this.registry = new ModuleRegistry(this)
    this.registry.init(GridManager)
  }
}
