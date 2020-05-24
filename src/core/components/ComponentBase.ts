import { el, mount, unmount, setAttr } from 'redom'
import Rectangle from '../../geometry/Rectangle'

export interface ComponentOptions {
  name: string
  content?: string
  tag?: string
  display?: boolean
  visible?: boolean
  classes?: string[]
  el?: HTMLElement
}
export default class ComponentBase {
  private static id: number = 0

  public id: number = 0
  public name: string
  public tag: string
  public display: boolean
  public visible: boolean
  public classes: string[]
  public class: string
  public el: HTMLElement

  constructor(options: ComponentOptions) {
    this.id = ComponentBase.id =+ 1
    this.name = options.name
    this.tag = options.tag || 'div'
    this.display = options.display || true
    this.visible = options.visible || true
    this.classes = options.classes || [options.name]
    this.class = this.classes.join(' ')
    this.el = options.el || el(this.tag, options.content || '')
    this.attributes({
      'class': this.class,
    })
  }

  attributes(value: object) {
    setAttr(this.el, value)
  }

  addClass(name: string): void {
    this.classes.push(name)
    this.class = this.classes.join(' ')
    setAttr(this.el, 'class', this.class)
  }

  removeClass(name: string): void {
    let index = this.classes.indexOf(name)
    if (index >= 0) {
      this.classes.splice(index, 1)
      this.class = this.classes.join(' ')
      setAttr(this.el, 'class', this.class)
    }
  }

  hasClass(name: string): boolean {
    return this.classes.indexOf(name) >= 0
  }

  update(content: string): void {
    this.el.textContent = content
  }

  on(name: string, listener: (this: HTMLElement, ev: Event) => any): void {
    this.el.addEventListener(name, listener)
  }

  mount(parent: HTMLElement, before?: HTMLElement, replace?: boolean): void {
    mount(parent, this.el, before, replace)
  }

  unmount(): void {
    let parent = this.el.parentElement
    if (parent) {
      unmount(parent, this.el)
    } else {
      throw new Error('You can not unmount an element with no parent')
    }
  }

  getBoundingRectangle(): Rectangle {
    return new Rectangle(this.el.getBoundingClientRect())
  }

  getZeroedBoundingRectangle(): Rectangle {
    let rect = this.getBoundingRectangle()
        rect.width = 0
        rect.height = 0
    return rect
  }

  destroy(): void {
    delete this.el
  }
}