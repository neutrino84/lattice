
import Core, { GridOptions } from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'
import RowNode from '../../modules/row/RowNode'

export default class RowManager extends Module {
  options: GridOptions
  component: GridComponent
  nodes: RowNode[] = []

  constructor(core: Core) {
    super(core)

    this.options = core.options
    this.component = core.grid
  }

  public init(): void {
    super.init()
  
    // initialize row nodes
    this.options.data.forEach((item: any) => {
      this.nodes.push(new RowNode(this, item))
    })
  }

  public destroy(): void {
    super.destroy()

    delete this.options
    delete this.component
    delete this.nodes
  }
}