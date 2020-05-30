
import EventEmitter from 'eventemitter3'
import ModuleRegistry from './ModuleRegistry'
import Logger from './Logger'

import GridManager from './modules/grid/GridManager'
import ColumnManager from './modules/column/ColumnManager'
import RowManager from './modules/row/RowManager'
import ScrollManager from './modules/scroll/ScrollManager'

import HeaderComponent from './components/HeaderComponent'
import GridComponent from './components/GridComponent'

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

export default class Core extends EventEmitter {
  public options: GridOptions
  public root: HTMLElement
  public registry: ModuleRegistry
  public logger: Logger

  public header: HeaderComponent
  public grid: GridComponent

  constructor(options: GridOptions) {
    super()

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

    // instantiate root components
    this.header = new HeaderComponent()
    this.grid = new GridComponent()

    // initialize base components
    this.header.mount(this.root)
    this.grid.mount(this.root)

    // instantiate logger
    this.logger = new Logger(options.debug || false)

    // instantiate module registry
    // the order these are passed matters
    this.registry = new ModuleRegistry(this)
    this.registry.init([
      ColumnManager,
      GridManager,
      ScrollManager,
      RowManager,
    ])
  }

  destroy(): void {
    this.header.destroy()
    this.grid.destroy()
    this.registry.destroy()

    delete this.root
    delete this.options
    delete this.header
    delete this.grid
    delete this.logger
    delete this.registry
  }
}
