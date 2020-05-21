import ComponentBase from './ComponentBase'

export default class CellComponent extends ComponentBase {
  constructor(content: string = '') {
    super({
      name: 'cell',
      classes: ['cell'],
      content: content,
    })
  }
}