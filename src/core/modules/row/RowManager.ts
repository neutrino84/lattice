
import Core, { ColumnDefinition } from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'
import GridManager from '../grid/GridManager'
import ScrollManager from '../scroll/ScrollManager'
import ComponentBase from '../../components/ComponentBase'

export default class RowManager extends Module {
  public data: any[]
  public definitions: ColumnDefinition[]
  public component: GridComponent

  public grid: GridManager | undefined
  public scroll: ScrollManager | undefined

  public nodes: RowNode[] = []
  public bounds: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)

    this.data = this.core.options.data
    this.definitions = this.core.options.definitions
    this.component = new ComponentBase({
      name: 'items'
    })
  }

  /*
   *
   */
  public init(): void {
    super.init()

    // mount row collection
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
    if (grid && grid.boundaries.grid) {
      bounds = this.bounds = grid.boundaries.grid.cloneZeroed()
      data.forEach((item: any) => {
        //
        node = new RowNode({
            manager: this,
            data: item,
        })

        if (scroll) {
          if (scroll.bounds.contains(bounds)) {
            node.mount()
          } else {
            node.init()
          }
        } else {
          node.mount()
        }

        // add node
        nodes.push(node)

        // extend row manager bounds
        bounds.extend(node.bounds)
      })

      //
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
    this.nodes.forEach((node) => {
      //.. redraw
    })
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