import ComponentBase from './ComponentBase'
import Rectangle from '../../geometry/Rectangle'

export default class ColumnRowComponent extends ComponentBase {
  public bounds = new Rectangle()

  constructor() {
    super({
      name: 'column-row',
    })
  }
}