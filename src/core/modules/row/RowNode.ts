import Node from '../Node'
import RowManager from './RowManager'
import Pool from '../../../utility/Pool'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'
import Rectangle from '../../../geometry/Rectangle'
import Cache from '../../../utility/Cache'
import { ColumnDefinition } from '../..'

export type RowOptions = {
  data: any
  manager: RowManager
}

export default class RowNode extends Node {
  private static cache = new Cache<Rectangle>()
  private static pool = new Pool<RowComponent>()

  public id: string
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
    this.id = this.classes().join('-')
  }

  /*
   * 
   */
  init(): void {
    let cached
    let cache = RowNode.cache
    let id = this.id
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
      this.mount(manager.bounds)
    }
  }

  /*
   * 
   */
  mount(alignment: Rectangle): void {
    let cache = RowNode.cache
    let manager = this.manager
    let bounds = this.bounds
    let data = this.data
    let definitions = this.definitions
    let component = this.component = new RowComponent(this)
    let id = this.id

    // create component and mount
    component.mount(manager.component.el)
    component.attributes({
      style: {
        transform: 'translate(0, ' + alignment.height + 'px)',
      }
    })

    // align bounds
    bounds.width = 0
    bounds.x = alignment.x
    bounds.y = alignment.y + alignment.height

    // create cell components
    definitions.forEach((definition) => {
      let cached
      let left = bounds.width
      let width = definition.width
      let value = data[definition.field]
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
      cached = cache.get(id + '-' + definition.field)
      if (!cached) {
        cached = cell.getBoundingRectangle()
        cache.set(id + '-' + definition.field, cached)
      }
      cached.y = bounds.y

      // update node bounds
      bounds.extend(cached)

      // add cell to collection
      component.cells.push(cell)
    })

    // cache node bounds
    cache.set(id, bounds)
  }

  update(): void {
    let definitions = this.definitions
    let component = this.component
    let data = this.data
    definitions.forEach((definition, index) => {
      component && component.cells[index].update(data[definition.field])
    })
  }

  show(): void {
    //..
  }

  hide(): void {
    //..
  }

  cull(): void {
    let id = this.id
    let component = this.component
    let pool = RowNode.pool
    if (component != null) {
      pool.checkin(id, component)
      component.attributes({
        style: {
          transform: 'translate(0, -100px)',
        }
      })
      this.component = null
    }
  }

  uncull(): void {
    let component
    let id = this.id
    let bounds = this.bounds
    if (this.component == null) {
      component = RowNode.pool.checkout(id)
      if (component) {
        this.component = component
        this.component.attributes({
          style: {
            transform: 'translate(0, ' + (bounds.y - bounds.height) + 'px)',
          }
        })
        this.update()
      } else {
        let cloned = bounds.clone()
            cloned.y = 0
            cloned.height = bounds.y
        this.mount(cloned)
      }
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