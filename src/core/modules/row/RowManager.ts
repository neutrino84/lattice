
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

  public grid: GridManager | undefined
  public scroll: ScrollManager | undefined

  public bounds: Rectangle = new Rectangle()
  public nodes: RowNode[] = []

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

        // create node if within
        // renderable rect
        if (scroll) {
          if (scroll.bounds.bottom >= bounds.bottom) {
            if (scroll.bounds.top <= bounds.top) {
              node.mount()

              // extend boundary to
              // include mounted node
              bounds.extend(node.bounds)
            }
          } else {
            // expand scroll bounds height
            // such that the scroll distance
            // is represented correctly
          }
        } else {
          node.mount()
        }

        // add node
        nodes.push(node)
      })
    } else {
      throw new Error('RowManager module requires GridManager module to be registered')
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