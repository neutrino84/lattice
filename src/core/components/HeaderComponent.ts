import ComponentBase from './ComponentBase'

export default class HeaderComponent extends ComponentBase {
  constructor() {
    super({
      name: 'header',
      classes: ['header'],
    })
  }
}