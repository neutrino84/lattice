import { el } from 'redom'

export default class ComponentBase {
  id: number
  name: string
  el: HTMLElement

  template = ''
  display: boolean = true
  visible: boolean = true
  classes: string[] = []

  constructor() {
    this.id = 0 
    this.name = ''
    this.el = el('div', 'hello')
  }

  init(): void {

  }

  destroy(): void {
    
  }
}