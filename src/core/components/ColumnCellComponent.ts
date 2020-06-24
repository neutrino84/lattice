import ComponentBase from './ComponentBase'
import ColumnNode from '../modules/column/ColumnNode'
import { ColumnDefinition } from '..'

export type Drag = {
  start: MouseEvent
  end: MouseEvent
  constraint: {
    max: number
    min: number
  }
}

export default class ColumnCellComponent extends ComponentBase {
  public node: ColumnNode
  public label: ComponentBase
  public handle: ComponentBase

  public left: number | undefined
  public width: number | undefined
  public definition: ColumnDefinition | undefined

  public listeners = new Array<(event: MouseEvent) => void>()
  public drag: Drag = {
    start: new MouseEvent('mousedown'),
    end: new MouseEvent('mouseup'),
    constraint: {
      max: 0,
      min: 0,
    }
  }


  constructor(node: ColumnNode) {
    super({
      name: 'column-cell'
    })

    // parent reference
    this.node = node

    // create label component
    this.label = new ComponentBase({ name: 'label' })
    this.label.mount(this.el)

    // create handle component
    this.handle = new ComponentBase({ name: 'column-handle' })
    this.handle.mount(this.el)
    this.handle.el.addEventListener('mousedown', this.onDragStart.bind(this), { capture: false })
  }

  public update(content: string): void {
    this.label.update(content)
  }

  public onDragStart(event: MouseEvent): void {
    let listeners = this.listeners
    let onDragEnd = this.onDragEnd.bind(this)
    let onMouseMove = this.onMouseMove.bind(this)

    this.drag.start = event

    listeners.push(onDragEnd)
    listeners.push(onMouseMove)

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    document.body.addEventListener('mouseup', onDragEnd, { capture: false })
    document.body.addEventListener('mousemove', onMouseMove, { capture: false })
  }

  public onMouseMove(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    this.definition && this.node.dragResizeStartColumnNodes(
      this.definition.field, event.screenX - this.drag.start.screenX
    )
  }

  public onDragEnd(event: MouseEvent): void {
    this.drag.end = event
    this.definition && this.node.dragResizeEndColumnNodes(
      this.definition.field,
      this.drag.end.screenX - this.drag.start.screenX
    )

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    document.body.removeEventListener('mouseup', this.listeners[0], { capture: false })
    document.body.removeEventListener('mousemove', this.listeners[1], { capture: false })

    this.listeners = []
  }
}