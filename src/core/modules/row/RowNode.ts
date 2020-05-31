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
  private static pool = new Map<string, RowComponent[]>()

  public data: any
  public manager: RowManager
  public component: RowComponent | null
  public definitions: ColumnDefinition[]

  public mounted = false
  public display = false
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
  init(): void {
    let cached
    let cache = RowNode.cache
    let id = this.classes().join('-')
    let manager = this.manager
    let bounds = this.bounds

    // set node boundaries
    bounds.x = manager.bounds.x
    bounds.y = manager.bounds.y + manager.bounds.height

    // get cached bounds
    cached = cache.get(id)
    if (cached) {
      bounds.width = cached.width
      bounds.height = cached.height
    } else {
      this.mount()
    }
  }

  /*
   * 
   */
  mount(): void {
    let cache = RowNode.cache
    let manager = this.manager
    let bounds = this.bounds
    let data = this.data
    let definitions = this.definitions
    let component = this.component = new RowComponent(this)

    // create component and mount
    component.mount(manager.component.el)
    component.attributes({
      style: {
        transform: 'translate(0, ' + manager.bounds.height + 'px)',
      }
    })

    // set node boundaries
    bounds.x = manager.bounds.x
    bounds.y = manager.bounds.y + manager.bounds.height

    // create cell components
    definitions.forEach((definition) => {
      let cached, id
      let value = data[definition.field]
      let left = bounds.width
      let width = definition.width
      let cell = new CellComponent(value)

      // mount and style
      cell.mount(component.el)
      cell.attributes({
        style: {
          width: width + 'px',
          left: left + 'px',
        }
      })

      // use cached cell boundaries
      // to improve performance
      id = component.classes.join('-')
      cached = cache.get(id + '-' + definition.field)
      if (!cached) {
        cached = cell.getBoundingRectangle()
        cache.set(id + '-' + definition.field, cached)
      }
      cached.y = bounds.y

      // update node bounds
      bounds.extend(cached)

      // cache node bounds
      cache.set(id, bounds)

      // add cell to collection
      component.cells.push(cell)
    })
  }

  update(): void {
    this.definitions.forEach((definition, index) => {
      this.component && this.component.cells[index].update(this.data[definition.field])
    })
  }

  show(): void {
    let component
    let bounds = this.bounds
    let pool = RowNode.pool
    if (!this.component) {
      let id = this.classes().join('-')
      let collection = pool.get(id)
      if (collection) {
        component = collection.pop()
        if (component) {
          this.component = component
          this.component.attributes({
            style: {
              visibility: 'visible',
              transform: 'translate(0, ' + (bounds.y - bounds.height) + 'px)',
            }
          })
          this.update()
        } else {
          // mount new component
        }
      }
    }
  }

  hide(): void {
    let pool = RowNode.pool
    if (this.component) {
      let id = this.classes().join('-')
      let collection = pool.get(id)
      if (!collection) {
        pool.set(id, [this.component])
      } else {
        collection.push(this.component)
      }
      this.component.attributes({
        style: {
          visibility: 'hidden'
        }
      })
      this.component = null
    }
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