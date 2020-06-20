import ComponentBase from './ComponentBase'

export default class CellComponent extends ComponentBase {
  public left = 0
  constructor(content: string = '') {
    super({
      name: 'cell',
      content: content,
    })
  }
}