import Node from '../Node'
import RowManager from './RowManager'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'
import Rectangle from '../../../geometry/Rectangle'
import Cache from '../../../utility/Cache'
import Pool from '../../../utility/Pool'
import { ColumnDefinition } from '../..'

export type RowOptions = {
  data: any
  manager: RowManager
  index: number
}

export default class RowNode extends Node {
  private static cache = new Cache<Rectangle>()
  private static pool = new Pool<RowComponent>()

  public data: any
  public type: string
  public manager: RowManager
  public index: number
  public component: RowComponent | null
  public definitions: ColumnDefinition[]

  public mounted = false
  public display = false
  public bounds = new Rectangle()

  constructor(options: RowOptions) {
    super()

    this.component = null
    this.manager = options.manager
    this.data = options.data
    this.definitions = options.manager.definitions
    this.index = options.index
    this.type = this.classes().join('-')
  }

  /*
   * 
   */
  init(): void {
    let cached
    let cache = RowNode.cache
    let type = this.type
    let manager = this.manager
    let bounds = this.bounds

    // set node boundaries
    bounds.x = manager.bounds.x
    bounds.y = manager.bounds.y + manager.bounds.height

    // get cached bounds
    cached = cache.get(type)
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
    let type = this.type

    // create component and mount
    component.mount(manager.component.el)

    // align bounds
    bounds.width = 0
    bounds.x = alignment.x
    bounds.y = alignment.y + alignment.height

    // create cell components
    definitions.forEach((definition, index) => {
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
      cached = cache.get(type + '-' + definition.field)
      if (!cached) {
        cached = cell.getBoundingRectangle()
        cache.set(type + '-' + definition.field, cached)
      }
      cached.y = bounds.y

      // update node bounds
      bounds.extend(cached)

      // add cell to collection
      component.cells.push(cell)

      // register cell to column
      if (manager.column) {
        manager.column.add(definition.field, cell)
      }
    })

    // position node and
    // set style attributes
    component.attributes({
      style: {
        height: bounds.height + 'px',
        width: bounds.width + 'px',
        transform: 'translate(0, ' + alignment.height + 'px)',
      }
    })

    // measure component bounds with cells
    // if it has not yet been cached
    let remeasure
    let cached = cache.get(type)
    if (!cached) {
      remeasure = component.getBoundingRectangle()
      bounds.height = remeasure.height
      cache.set(type, bounds)
    } else {
      bounds.height = cached.height
    }
  }

  update(): void {
    let definitions = this.definitions
    let component = this.component
    let data = this.data

    // update cells by definition
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
    let type = this.type
    let component = this.component
    let pool = RowNode.pool
    if (component != null) {
      pool.checkin(type, component)
      component.attributes({
        style: {
          transform: 'translate(0, -100px)',
        }
      })
      this.component = null
    }
  }

  uncull(): void {
    let translate
    let component
    let type = this.type
    let bounds = this.bounds
    let manager = this.manager
    if (this.component == null) {
      translate = bounds.y - bounds.height - manager.bounds.y
      component = RowNode.pool.checkout(type)
      if (component) {
        this.component = component
        this.component.attributes({
          style: {
            transform: 'translate(0, ' + translate + 'px)',
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
    let options = this.manager.core.options
    let classes = options.classes
    let parity = this.index % 2 == 0 ? 'even': 'odd'
    let base = ['row', parity]
    if (typeof classes === 'function') {
      return classes(this.data).concat(base)
    } else if(classes) {
      return classes.concat(base)
    } else {
      return base
    }
  }
}