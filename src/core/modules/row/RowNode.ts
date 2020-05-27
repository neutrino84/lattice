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

  mount(): void {
    if (this.mounted) {
      throw new Error('cannot re-mount a mounted row node')
    }

    // create component and mount
    this.component = new RowComponent()
    this.component.mount(this.manager.component.el)
    this.component.attributes({
      style: {
        top: this.manager.bounds.height + 'px'
      }
    })

    // set node boundaries
    this.bounds.x = this.manager.bounds.x
    this.bounds.y = this.manager.bounds.y + this.manager.bounds.height

    // create cell components
    this.definitions.forEach((definition) => {
      let cached, id
      let cache = RowNode.cache
      let bounds = this.bounds
      let component = this.component
      let value = this.data[definition.field]
      let left = this.bounds.width
      let width = definition.width
      let cell = new CellComponent(value)

      if (component) {
        // mount cells
        cell.mount(component.el)
        cell.attributes({
          style: {
            width: width + 'px',
            left: left + 'px',
          }
        })

        // use cached cell boundaries
        id = component.class + definition.field
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
      this.cells.push(cell)
    })

    // mount successful
    this.mounted = true
  }

  render(): void {
    this.cells.forEach((cell, index) => {
      cell.update(this.data[index])
    })
  }
}