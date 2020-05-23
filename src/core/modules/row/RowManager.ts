
import Core, { GridOptions } from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'
import RowNode from '../../modules/row/RowNode'
import Rectangle from '../../../geometry/Rectangle'

export default class RowManager extends Module {
  options: GridOptions
  component: GridComponent
  bounds: Rectangle = new Rectangle()
  nodes: RowNode[] = []

  constructor(core: Core) {
    super(core)

    this.options = core.options
    this.component = core.grid
  }

  public init(): void {
    super.init()

    // initialize grid bounds
    this.bounds = this.core.grid.getBoundingRectangle()

    // initialize row nodes
    this.options.data.forEach((item: any) => {
      let node
      let bounds = this.bounds
      let nodes = this.nodes
      
      // create node
      node = new RowNode({
        manager: this,
        data: item,
      })

      // add node
      nodes.push(node)

      // extend local bounds
      bounds.extend(node.bounds)
    })
  }

  public destroy(): void {
    super.destroy()

    delete this.options
    delete this.component
    delete this.nodes
    delete this.bounds
  }
}