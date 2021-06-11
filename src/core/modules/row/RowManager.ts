
import Core, { ColumnDefinition } from '../..'
import Module from '../Module'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'
import ColumnManager from '../column/ColumnManager'
import GridManager from '../grid/GridManager'
import ScrollManager from '../scroll/ScrollManager'
import RowItemsComponent from '../../components/RowItemsComponent'

export default class RowManager extends Module {
  public grid: GridManager | undefined
  public column: ColumnManager | undefined
  public scroll: ScrollManager | undefined

  public data: any[]
  public definitions: ColumnDefinition[]
  public component: RowItemsComponent

  public nodes = new Array<RowNode>()
  public bounds: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)

    this.data = this.core.options.data
    this.definitions = this.core.options.definitions
    this.component = new RowItemsComponent()
  }

  /*
   *
   */
  public init(): void {
    super.init()

    // manager references
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.column = this.core.registry.get<ColumnManager>('ColumnManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')

    // mount row items component
    this.grid && this.component.mount(this.grid.component.el)
  }

  /*
   *
   */
  public mount(): void {
    //..
  }

  /*
   *
   */
  public mounted(): void {
    let node: RowNode
    let bounds = this.bounds
    let data = this.data
    let nodes = this.nodes
    let grid = this.grid
    let scroll = this.scroll
    let component = this.component
    if (grid != undefined) {
      // initialize row manager boundary
      bounds.copy(grid.component.bounds)
      bounds.height = 0

      // create nodes from data
      data.forEach((item: any, index) => {
        node = new RowNode({
            manager: this,
            data: item,
            index: index,
        })

        // mount or init
        if (scroll) {
          if (scroll.bounds.contains(bounds)) {
            node.mount(bounds)
          } else {
            node.init()
          }
        } else {
          node.mount(bounds)
        }

        // add node
        nodes.push(node)

        // extend row manager bounds
        bounds.extend(node.bounds)
      })

      // set scrollable region
      component.attributes({
        style: {
          height: bounds.height + 'px'
        }
      })
    } else {
      throw new Error('RowManager module requires GridManager module to be registered')
    }
  }

  /*
   *
   */
  public update(): void {
    this.nodes.forEach(node => node.update)
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()

    // delete this.data
    // delete this.definitions
    // delete this.component
    // delete this.nodes
    // delete this.bounds
  }
}