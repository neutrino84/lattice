import ComponentBase from './ComponentBase'
import Rectangle from '../../geometry/Rectangle'

export default class RootComponent extends ComponentBase {
  public bounds = new Rectangle()

  constructor(el: HTMLElement) {
    super({
      name: 'root',
      el: el,
    })
  }

  resize(): void {
    this.bounds = this.getBoundingRectangle()
  }
}