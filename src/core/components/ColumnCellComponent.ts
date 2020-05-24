import ComponentBase from './ComponentBase'

export default class ColumnCellComponent extends ComponentBase {
  constructor(content: string = '') {
    super({
      name: 'column-cell',
      content: content,
    })
  }
}