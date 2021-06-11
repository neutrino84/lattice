import Logger from './Logger'
import ModuleRegistry from './ModuleRegistry'

import GridManager from './modules/grid/GridManager'
import ColumnManager from './modules/column/ColumnManager'
import RowManager from './modules/row/RowManager'
import ScrollManager from './modules/scroll/ScrollManager'

export type ColumnDefinition = {
  name: string
  field: string
  width: number
}

export interface GridOptions {
  element: HTMLElement | string
  data: any[]
  definitions: ColumnDefinition[]
  classes?: string[] | ((data:any) => string[])
  debug?: boolean
}

export default class Core {
  public root: HTMLElement
  public logger: Logger
  public options: GridOptions
  public registry: ModuleRegistry

  constructor(options: GridOptions) {
    this.options = options
    if (typeof options.element === 'string') {
      let element = document.getElementById(options.element)
      if (element instanceof HTMLElement) {
        this.root = element
      } else {
        throw new Error('Grid root element could not be found.')
      }
    } else if (options.element instanceof HTMLElement) {
      this.root = options.element
    } else {
      throw Error('Grid root element must be specified.')
    }

    // instantiate logger
    this.logger = new Logger(options.debug || false)

    // instantiate module registry
    // the order these are passed matters
    this.registry = new ModuleRegistry(this)
    this.registry.init([
      GridManager,
      ScrollManager,
      ColumnManager,
      RowManager,
    ])
  }

  destroy(): void {
    this.registry.destroy()

    // delete this.root
    // delete this.options
    // delete this.logger
    // delete this.registry
  }
}
