import ComponentBase from './ComponentBase'
import RowNode from '../modules/row/RowNode'
import CellComponent from './CellComponent'

export default class RowComponent extends ComponentBase {
  public node: RowNode | undefined
  public cells = new Array<CellComponent>()

  constructor(node: RowNode) {
    super({
      name: 'row',
      classes: node.classes()
    })
    this.node = node
  }
}
