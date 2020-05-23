
import Core, { GridOptions } from '../..'
import Module from '../Module'
import ColumnNode from './ColumnNode'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import HeaderComponent from '../../components/HeaderComponent'
import Rectangle from '../../../geometry/Rectangle'

export default class ColumnManager extends Module {
  public options: GridOptions
  public component: HeaderComponent
  public nodes: ColumnNode[] = []
  public bounds: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)

    this.options = core.options
    this.component = new ColumnRowComponent()
    this.component.mount(this.core.header.el)
  }

  public init(): void {
    super.init()

    // update local bounds w/ component
    // width zeroed (to help align column components)
    this.bounds = this.component.getZeroedBoundingRectangle()

    // initialize row nodes
    this.options.definitions.forEach(definition => {
      let nodes = this.nodes
      let bounds = this.bounds
      let node = new ColumnNode(this, definition)

      nodes.push(node)

      // extend local bounds
      bounds.extend(node.component.getBoundingRectangle())
    })

    this.component.attributes({
      style: {
        height: this.bounds.height + 'px'
      }
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