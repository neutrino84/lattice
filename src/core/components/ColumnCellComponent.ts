import ComponentBase from './ComponentBase'
import ColumnNode from '../modules/column/ColumnNode'
import { ColumnDefinition } from '..'

export default class ColumnCellComponent extends ComponentBase {
  public node: ColumnNode
  public label: ComponentBase
  public handle: ComponentBase

  public left: number | undefined
  public width: number | undefined
  public definition: ColumnDefinition | undefined

  public start = new MouseEvent('mousedown')
  public end = new MouseEvent('mouseup')

  public listeners = new Array<(event: MouseEvent) => void>()

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


  public onDragStart(event: MouseEvent): void {
    console.log('start')

    let listeners = this.listeners

    let onDragEnd = this.onDragEnd.bind(this)
    let onMouseMove = this.onMouseMove.bind(this)

    this.start = event

    listeners.push(onDragEnd)
    listeners.push(onMouseMove)

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    document.body.addEventListener('mouseup', onDragEnd, { capture: false })
    document.body.addEventListener('mousemove', onMouseMove, { capture: false })
  }

  public onMouseMove(event: MouseEvent): void {
    console.log('move')

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    this.definition && this.node.dragResizeColumnNodes(
      this.definition.field, event.screenX - this.start.screenX
    )
  }

  public onDragEnd(event: MouseEvent): void {
    console.log('end')

    this.end = event

    this.definition && this.node.dragEndColumnNodes(
      this.definition.field,
      this.end.screenX - this.start.screenX
    )

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    document.body.removeEventListener('mouseup', this.listeners[0], { capture: false })
    document.body.removeEventListener('mousemove', this.listeners[1], { capture: false })

    this.listeners = []
  }

  update(content: string): void {
    this.label.update(content)
  }
}