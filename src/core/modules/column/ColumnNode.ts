import ColumnManager from '../column/ColumnManager'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import ColumnCellComponent from '../../components/ColumnCellComponent'
import Rectangle from '../../../geometry/Rectangle'
import { ColumnDefinition } from '../..'

export type ColumnOptions = {
  definitions: ColumnDefinition[]
  manager: ColumnManager
  index: number
}

export default class ColumnNode {
  public manager: ColumnManager
  public index: number
  public definitions: ColumnDefinition[]

  public type = 'header'
  public component = new ColumnRowComponent(this)
  public bounds = new Rectangle()
  public start = new MouseEvent('mousedown')
  public listeners = new Array<(event: MouseEvent) => void>()

  constructor(options: ColumnOptions) {
    this.manager = options.manager
    this.definitions = options.definitions
    this.index = options.index

    // this.component.dragger.el.addEventListener('mousedown', this.onDragStart.bind(this), { capture: false })
  }

  public init(): void {
    //..
  }

  public mount(alignment: Rectangle): void {
    let manager = this.manager
    let definitions = this.definitions
    let component = this.component
    let bounds = this.bounds

    // mount component
    component.mount(manager.component.el)

    bounds.width = 0
    bounds.x = alignment.x
    bounds.y = alignment.y + alignment.height

    definitions.forEach((definition) => {
      let left = bounds.width
      let width = definition.width
      let value = definition.name
      let cell = new ColumnCellComponent(this)

      // mount and style
      cell.left = left
      cell.update(value)
      cell.mount(component.el)
      cell.attributes({
        style: {
          width: width + 'px',
          left: left + 'px',
        }
      })

      // update node bounds
      bounds.extend(cell.getBoundingRectangle())

      // add cell to collection
      component.cells.push(cell)
    })

    // position node and
    // set style attributes
    component.attributes({
      style: {
        height: bounds.height + 'px',
        width: bounds.width + 'px',
      }
    })
  }

  // public onDragStart(event: MouseEvent): void {
  //   console.log('start')

  //   let listeners = this.listeners
  //   let onDragEnd = this.onDragEnd.bind(this)
  //   let onMouseMove = this.onMouseMove.bind(this)

  //   this.start = event

  //   listeners.push(onDragEnd)
  //   listeners.push(onMouseMove)

  //   document.body.addEventListener('mouseup', onDragEnd, { capture: false })
  //   document.body.addEventListener('mousemove', onMouseMove, { capture: false })
  // }

  // public onMouseMove(event: MouseEvent): void {
  //   let delta = event.screenX - this.start.screenX
  //   this.manager.resizeColumnNodes(this.definition.field, delta)
  //   this.component.attributes({
  //     style: {
  //       width: this.definition.width + delta + 'px'
  //     }
  //   })
  //   event.preventDefault()
  // }

  // public onDragEnd(event: MouseEvent): void {
  //   console.log('end')
  //   event.stopImmediatePropagation()
  //   document.body.removeEventListener('mouseup', this.listeners[0], { capture: false })
  //   document.body.removeEventListener('mousemove', this.listeners[1], { capture: false })
  // }
}