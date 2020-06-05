
import Core, { GridOptions } from '../..'
import Module from '../Module'
import ColumnNode from './ColumnNode'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import HeaderComponent from '../../components/HeaderComponent'
import CellComponent from '../../components/CellComponent'
import Rectangle from '../../../geometry/Rectangle'

export default class ColumnManager extends Module {
  public options: GridOptions
  public component: HeaderComponent

  public bounds = new Rectangle()
  public nodes = new Array<ColumnNode>()
  public columns = new Map<string, CellComponent[]>()

  constructor(core: Core) {
    super(core)

    this.options = core.options
    this.component = new ColumnRowComponent()
  }

  public init(): void {
    super.init()

    // mount column row component
    this.component.mount(this.core.header.el)

    // update local bounds w/ component bounds
    // zeroed (to align column components)
    this.bounds = this.component.getZeroedBoundingRectangle()
  }

  /*
   *
   */
  public mount(): void {
    let node
    let nodes = this.nodes
    let bounds = this.bounds
    let columns = this.columns
    let component = this.component
    let options = this.options

    // initialize row nodes
    options.definitions.forEach(definition => {
      // create new node instance
      node = new ColumnNode(this, definition)

      // init cell collection
      columns.set(definition.field, new Array<CellComponent>())

      // add node to collection
      nodes.push(node)

      // extend local bounds
      bounds.extend(node.component.getBoundingRectangle())
    })

    //
    component.attributes({
      style: {
        height: this.bounds.height + 'px'
      }
    })
  }

  /*
   *
   */
  public add(key: string, cell: CellComponent): void {
    let collection = this.columns.get(key)
    if (collection) {
      collection.push(cell)
    }
  }

  /*
   *
   */
  public remove(key: string, cell: CellComponent): void {
    let index
    let collection = this.columns.get(key)
    if (collection) {
      index = collection.indexOf(cell)
      collection.splice(index, 1)
    }
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()

    delete this.options
    delete this.component
    delete this.nodes
    delete this.bounds
  }
}