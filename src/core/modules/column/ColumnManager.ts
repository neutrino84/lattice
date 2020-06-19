
import Module from '../Module'
import Core, { GridOptions } from '../..'
import GridManager from '../grid/GridManager'
import RowManager from '../row/RowManager'
import ScrollManager from '../scroll/ScrollManager'
import ColumnNode from './ColumnNode'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import CellComponent from '../../components/CellComponent'

export default class ColumnManager extends Module {
  public row: RowManager | undefined
  public grid: GridManager | undefined
  public scroll: ScrollManager | undefined

  public options: GridOptions
  public component: ColumnRowComponent
  public nodes = new Array<ColumnNode>()
  public columns = new Map<string, CellComponent[]>()

  constructor(core: Core) {
    super(core)

    this.options = core.options
    this.component = new ColumnRowComponent()
  }

  public init(): void {
    super.init()

    // manager module references
    this.row = this.core.registry.get<RowManager>('RowManager')
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')

    // mount column row component
    this.grid && this.component.mount(this.grid.header.el)

    // update local bounds w/ component bounds
    // and zero width to add cells
    this.component.bounds = this.component.getZeroedBoundingRectangle()
  }

  /*
   *
   */
  public mount(): void {
    let node
    let width
    let nodes = this.nodes
    let columns = this.columns
    let component = this.component
    let options = this.options

    // initialize row nodes
    options.definitions.forEach(definition => {
      // create new node instance
      node = new ColumnNode(this, definition)

      // init cell collection
      columns.set(definition.field, new Array<CellComponent>())

      // add node to collection
      nodes.push(node)

      // extend local bounds
      component.bounds.extend(node.component.getBoundingRectangle())
    })

    // set column row component height
    component.attributes({
      style: {
        height: component.bounds.height + 'px'
      }
    })

    // save column row width
    width = component.bounds.width

    // re-calculate column component bounds
    // to account for margin, padding, border
    component.bounds = component.getBoundingRectangle()

    // bounds width must be set to full size
    if (width > component.bounds.width) {
      component.bounds.width = width
    }
  }

  /*
   *
   */
  public add(key: string, cell: CellComponent): void {
    let collection = this.columns.get(key)
    if (collection) {
      collection.push(cell)
    }
  }

  /*
   *
   */
  public remove(key: string, cell: CellComponent): void {
    let index
    let collection = this.columns.get(key)
    if (collection) {
      index = collection.indexOf(cell)
      collection.splice(index, 1)
    }
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()

    this.component.destroy()

    delete this.row
    delete this.grid
    delete this.scroll
    delete this.options
    delete this.options
    delete this.nodes
    delete this.columns
  }
}