
import Core, { ColumnDefinition } from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'
import GridManager from '../grid/GridManager'
import ScrollManager from '../scroll/ScrollManager'

export default class RowManager extends Module {
  public data: any[]
  public definitions: ColumnDefinition[]
  public component: GridComponent
  public bounds: Rectangle = new Rectangle()
  public nodes: RowNode[] = []

  public grid: GridManager | undefined
  public scroll: ScrollManager | undefined

  constructor(core: Core) {
    super(core)

    this.data = this.core.options.data
    this.definitions = this.core.options.definitions
    this.component = this.core.grid
  }

  /*
   *
   */
  public init(): void {
    super.init()

    // manager references
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')
  }

  /*
   *
   */
  public mount(): void {
    let node: RowNode,
        bounds: Rectangle,
        data = this.data,
        nodes = this.nodes,
        grid = this.grid,
        scroll = this.scroll
    if (grid && grid.boundaries.grid) {
      // initialize boundary for row nodes
      bounds = this.bounds = grid.boundaries.grid.cloneZeroed()
      
      // build row nodes
      data.forEach((item: any) => {
        node = new RowNode({
          manager: this,
          data: item,
        })

        // create node if within view distance
        if (scroll) {
          if (scroll.bounds.bottom >= bounds.bottom) {
            if (scroll.bounds.top <= bounds.top) {
              node.create()
            }
          } else {
            //.. expand scroll bounds height
          }
        } else {
          node.create()
        }

        // add node
        nodes.push(node)

        // extend boundary
        // to include new node
        bounds.extend(node.bounds)
      })
    } else {
      throw new Error('RowManager requires GridManager module to function')
    }
  }

  /*
   *
   */
  public render(): void {
    this.nodes.forEach((item: any) => {
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