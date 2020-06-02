
import Core, { ColumnDefinition } from '../..'
import Module from '../Module'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'
import GridManager from '../grid/GridManager'
import ScrollManager from '../scroll/ScrollManager'
import RowItemsComponent from '../../components/RowItemsComponent'

export default class RowManager extends Module {
  public data: any[]
  public definitions: ColumnDefinition[]
  public component: RowItemsComponent

  public grid: GridManager | undefined
  public scroll: ScrollManager | undefined

  public nodes: RowNode[] = []
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

    // mount row items component
    this.component.mount(this.core.grid.el)

    // manager references
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')
  }

  /*
   *
   */
  public mount(): void {
    let node: RowNode
    let bounds: Rectangle
    let data = this.data
    let nodes = this.nodes
    let grid = this.grid
    let scroll = this.scroll
    let component = this.component
    if (grid != undefined) {
      // initialize row manager boundary
      bounds = this.bounds = grid.boundaries.grid.cloneZeroed()
      bounds.width = grid.boundaries.grid.width

      // create nodes from data
      data.forEach((item: any) => {
        node = new RowNode({
            manager: this,
            data: item,
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

    delete this.data
    delete this.definitions
    delete this.component
    delete this.nodes
    delete this.bounds
  }
}