import ComponentBase from './ComponentBase'
import RowNode from '../modules/row/RowNode'
import CellComponent from './CellComponent'

export default class RowComponent extends ComponentBase {
  node: RowNode
  cells: CellComponent[] = []

  constructor(node: RowNode) {
    super({
      name: 'row',
      classes: node.classes()
    })
    this.node = node
  }

  update(data: any): void {

  }
}