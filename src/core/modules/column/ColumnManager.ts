
import Core, { GridOptions } from '../..'
import Module from '../Module'
import ColumnNode from './ColumnNode'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import HeaderComponent from '../../components/HeaderComponent'

export default class ColumnManager extends Module {
  public options: GridOptions
  public component: HeaderComponent
  public nodes: ColumnNode[] = []

  constructor(core: Core) {
    super(core)

    this.options = core.options
    
    // create row component and mount
    this.component = new ColumnRowComponent()
    this.component.mount(core.header.el)
    this.component.attributes({
      style: {
        height: core.options.row.height + 'px'
      }
    })
  }

  public init(): void {
    super.init()

    // initialize row nodes
    this.options.definitions.forEach(definition => {
      this.nodes.push(new ColumnNode(this, definition))
    })
  }

  public destroy(): void {
    super.destroy()

    delete this.options
    delete this.component
    delete this.nodes
  }
}