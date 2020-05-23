
import EventEmitter from 'eventemitter3'
import ModuleRegistry from './ModuleRegistry'
import GridManager from './modules/grid/GridManager'
import ColumnManager from './modules/column/ColumnManager'
import RowManager from './modules/row/RowManager'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import GridComponent from './components/GridComponent'
import Logger from './Logger'

export type ColumnDefinition = {
  name: string
  field: string
  width: number
}

export interface GridOptions {
  debug: boolean
  element: HTMLElement | string
  data: any[]
  definitions: ColumnDefinition[]
}

export default class Core extends EventEmitter {
  public options: GridOptions
  public root: HTMLElement
  public registry: ModuleRegistry
  public logger: Logger

  public header: HeaderComponent
  public footer: FooterComponent
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
    this.footer = new FooterComponent()

    // initialize base components
    this.header.mount(this.root)
    this.grid.mount(this.root)
    this.footer.mount(this.root)

    // instantiate logger
    this.logger = new Logger(options.debug)

    // instantiate module registry
    this.registry = new ModuleRegistry(this)
    this.registry.init([GridManager, ColumnManager, RowManager])
  }
}
