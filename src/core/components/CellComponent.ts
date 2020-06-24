import ComponentBase from './ComponentBase'

export default class CellComponent extends ComponentBase {
  public left: number | undefined
  public width: number | undefined
  constructor(content: string = '') {
    super({
      name: 'cell',
      content: content,
    })
  }
}
