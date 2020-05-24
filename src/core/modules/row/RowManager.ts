
import Core, { ColumnDefinition } from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'

export default class RowManager extends Module {
  public static SCROLL_POLLING_RATE_MS = 500

  public data: any[]
  public definitions: ColumnDefinition[]
  public component: GridComponent
  public debounce: NodeJS.Timeout | undefined
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

    this.create()
  }

  /*
   *
   */
  public create(): void {
    // initialize grid bounds
    this.bounds = this.core.grid.getZeroedBoundingRectangle()

    // initialize row nodes
    this.data.forEach((item: any) => {
      let node
      let bounds = this.bounds
      let nodes = this.nodes
      
      // instantiate node
      node = new RowNode({
        manager: this,
        data: item,
      })

      // create node if within renderable
      // if (boundary.bottom > bounds.bottom) {
        node.create()
      // }

      // add node
      nodes.push(node)

      // extend local bounds
      bounds.extend(node.bounds)
    })

    // notify rows rendered
    this.core.emit('row:nodes:created', this.nodes)
  }

  /*
   *
   */
  public render(): void {
    this.data.forEach((item: any) => {
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