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
  public static cache = new Cache<Rectangle>()
  public static pool = new Pool<RowComponent>()

  public data: any
  public type: string
  public manager: RowManager
  public index: number
  public definitions: ColumnDefinition[]
  public component: RowComponent | null

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
  mount(alignment: Rectangle | undefined = undefined): void {
    let height
    let cache = RowNode.cache
    let manager = this.manager
    let bounds = this.bounds
    let data = this.data
    let definitions = this.definitions
    let component = this.component = new RowComponent(this)
    let type = this.type

    // mount component
    component.mount(manager.component.el)

    // reset width
    bounds.width = 0

    // apply positioning
    if (alignment) {
      bounds.x = alignment.x
      bounds.y = alignment.y + alignment.height
    }

    // create cell components
    definitions.forEach((definition) => {
      let cached
      let left = bounds.width
      let width = definition.width
      let value = data[definition.field]
      let cell = new CellComponent(value)

      // mount and style
      cell.left = left
      cell.width = width
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
        // get bounding rectangle of cell
        // to find border, margin, padding
        cached = cell.getBoundingRectangle()

        // account for horizontal scrolling
        if (manager.grid) {
          cached.x += manager.grid.component.el.scrollLeft
        }
        cache.set(type + '-' + definition.field, cached)
      }
      cached.y = bounds.y

      // update node bounds
      bounds.extend(cached)

      // add cell to collection
      component.cells.push(cell)
    })

    // position node and
    // set style attributes
    height = alignment ? alignment.height : bounds.y
    component.attributes({
      style: {
        height: bounds.height + 'px',
        width: bounds.width + 'px',
        transform: 'translate(0, ' + height + 'px)',
      }
    })

    if (alignment == undefined) {
      component.attributes({
        style: {
          background: '#fff4f4'
        }
      })
    }

    // measure component bounds with cells
    // if it has not yet been cached
    let remeasure
    let cached = cache.get(type)
    if (!cached) {
      remeasure = component.getBoundingRectangle()
      cache.set(type, remeasure)
    } else {
      bounds.width = cached.width
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
      pool.release(type, component)
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
      translate = bounds.y - manager.bounds.y
      component = RowNode.pool.acquire(type)
      if (component) {
        this.component = component
        this.component.attributes({
          style: {
            transform: 'translate(0, ' + translate + 'px)',
          }
        })
        this.update()
      } else {
        this.mount()
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