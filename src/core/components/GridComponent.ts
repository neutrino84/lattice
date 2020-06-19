import ComponentBase from './ComponentBase'
import Rectangle from '../../geometry/Rectangle'

export default class GridComponent extends ComponentBase {
  public bounds = new Rectangle()

  constructor() {
    super({
      name: 'grid',
    })
  }

  resize(height: number): void {
    this.attributes({
      style: {
        height: height + 'px'
      }
    })
    this.bounds = this.getBoundingRectangle()
  }
}