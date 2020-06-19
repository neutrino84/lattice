import ComponentBase from './ComponentBase'
import Rectangle from '../../geometry/Rectangle'

export default class FooterComponent extends ComponentBase {
  public bounds = new Rectangle()

  constructor() {
    super({
      name: 'footer',
    })
  }
}