import ComponentBase from './ComponentBase'
import ColumnCellComponent from './ColumnCellComponent'
import ColumnNode from '../modules/column/ColumnNode'

export default class ColumnRowComponent extends ComponentBase {
  public node: ColumnNode | undefined
  public cells = new Array<ColumnCellComponent>()

  constructor(node: ColumnNode) {
    super({
      name: 'column-row',
    })
    this.node = node
  }
}
