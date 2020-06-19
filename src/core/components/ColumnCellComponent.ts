import ComponentBase from './ComponentBase'
import ColumnNode from '../modules/column/ColumnNode'

export default class ColumnCellComponent extends ComponentBase {
  node: ColumnNode
  label: ComponentBase
  dragger: ComponentBase

  constructor(node: ColumnNode) {
    super({
      name: 'column-cell'
    })

    // parent reference
    this.node = node

    // create label component
    this.label = new ComponentBase({ name: 'label' })
    this.label.mount(this.el)

    // create dragger component
    this.dragger = new ComponentBase({ name: 'column-dragger' })
    this.dragger.mount(this.el)
    // this.dragger.el.addEventListener('mousedown', this.node.onDragMouseDown.bind(this.node), { capture: true })
    // this.dragger.el.addEventListener('mouseup', this.node.onDragMouseUp.bind(this.node), { capture: true })
  }

  update(content: string): void {
    this.label.update(content)
  }
}