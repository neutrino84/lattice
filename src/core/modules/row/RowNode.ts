import Node from '../Node'
import RowManager from './RowManager'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'
import Rectangle from '../../../geometry/Rectangle'
import { ColumnDefinition } from '../..'

export type RowOptions = {
  data: any
  manager: RowManager
}

export default class RowNode extends Node {
  private static cache = new Map<string, Rectangle>()

  public data: any
  public manager: RowManager
  public component: RowComponent | null
  public cells: CellComponent[] = []
  public definitions: ColumnDefinition[]

  public mounted = false
  public bounds = new Rectangle()

  constructor(options: RowOptions) {
    super()

    this.manager = options.manager
    this.data = options.data
    this.definitions = options.manager.definitions
    this.component = null
  }

  /*
   * 
   */
  mount(): void {
    let component: RowComponent
    let manager = this.manager
    let cells = this.cells
    let bounds = this.bounds
    let data = this.data
    let definitions = this.definitions

    // create component and mount
    component = this.component = new RowComponent(this)
    component.mount(manager.component.el)
    component.attributes({
      style: {
        top: manager.bounds.height + 'px'
      }
    })

    // set node boundaries
    bounds.x = manager.bounds.x
    bounds.y = manager.bounds.y + manager.bounds.height

    // create cell components
    definitions.forEach((definition) => {
      let cached, id
      let cache = RowNode.cache
      let value = data[definition.field]
      let left = bounds.width
      let width = definition.width
      let cell = new CellComponent(value)

      if (component) {
        // mount cell
        cell.mount(component.el)
        cell.attributes({
          style: {
            width: width + 'px',
            left: left + 'px',
          }
        })

        // use cached cell boundaries
        // to improve performance
        id = component.classes.join('-') + '-' + definition.field
        cached = cache.get(id)
        if (!cached) {
          cached = cell.getBoundingRectangle()
          cache.set(id, cached)
        }
        cached.y = bounds.y

        // update node boundary
        bounds.extend(cached)
      }

      // add cell to collection
      cells.push(cell)
    })
  }

  render(): void {
    //..
  }

  show(): void {
    //..
  }

  hide(): void {
    //..
  }

  classes(): string[] {
    let base = ['row']
    let options = this.manager.core.options
    let classes = options.classes
    if (typeof classes === 'function') {
      return classes(this.data).concat(base)
    } else if(classes) {
      return classes.concat(base)
    } else {
      return base
    }
  }
}