
import Module from '../Module'
import Core, { ColumnDefinition } from '../..'
import GridManager from '../grid/GridManager'
import RowManager from '../row/RowManager'
import ScrollManager from '../scroll/ScrollManager'
import ColumnNode from './ColumnNode'
import ColumnItemsComponent from '../../components/ColumnItemsComponent'
import Rectangle from '../../../geometry/Rectangle'

export default class ColumnManager extends Module {
  public grid: GridManager | undefined
  public row: RowManager | undefined
  public scroll: ScrollManager | undefined

  public definitions: ColumnDefinition[]
  public component: ColumnItemsComponent

  public nodes = new Array<ColumnNode>()
  public bounds: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)

    this.definitions = this.core.options.definitions
    this.component = new ColumnItemsComponent()
  }

  public init(): void {
    super.init()

    // manager module references
    this.row = this.core.registry.get<RowManager>('RowManager')
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')

    // mount column row component
    this.grid && this.component.mount(this.grid.header.el)
  }

  public mount(): void {
    let nodes = this.nodes
    let bounds = this.bounds
    let component = this.component
    let grid = this.grid
    let node = new ColumnNode({
      manager: this,
      definitions: this.definitions,
      index: 0,
    })
    if (grid != undefined) {
      bounds.copy(grid.component.bounds)

      //
      node.init()
      node.mount(bounds)

      //
      nodes.push(node)

      //
      bounds.extend(node.bounds)

      // set scrollable region
      component.attributes({
        style: {
          height: bounds.height + 'px'
        }
      })
    } else {
      throw new Error('ColumnManager module requires GridManager module to be registered')
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
    delete this.definitions
    delete this.nodes
  }
}