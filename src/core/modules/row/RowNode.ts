import Node from '../Node'
import RowManager from '../row/RowManager'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'
import { ColumnDefinition } from '../..'

export type RowOptions = {
  data: any
  manager: RowManager
}

export default class RowNode extends Node {
  public static DEFAULT_WIDTH = 180

  public data: any
  public manager: RowManager
  public component: RowComponent | null
  public cells: CellComponent[] = []
  public definitions: ColumnDefinition[]

  constructor(options: RowOptions) {
    super()

    this.manager = options.manager
    this.data = options.data
    this.definitions = options.manager.definitions
    this.component = null
  }

  create(): void {
    // create row component and mount
    this.component = new RowComponent() // load from pool
    this.component.mount(this.manager.component.el)
    this.component.attributes({
      style: {
        top: this.manager.bounds.height + 'px'
      }
    })

    // update local bounds w/ component
    // width zeroed (to help align cell components)
    this.bounds = this.component.getZeroedBoundingRectangle()

    // create cell components
    this.definitions.forEach((definition) => {
      let cells = this.cells
      let value = this.data[definition.field]
      let cell = new CellComponent(value)

      cells.push(cell)
    })

    // mount cell components
    this.cells.forEach((cell, index) => {
      let bounds = this.bounds
      let left = this.bounds.width
      let definition = this.definitions[index]
      let width = definition.width || RowNode.DEFAULT_WIDTH

      // configure cell
      if (this.component) {
        cell.mount(this.component.el)
        cell.attributes({
          style: {
            width: width + 'px',
            left: left + 'px',
          }
        })
      } else {
        //.. throw error
      }

      // extend row bounds
      bounds.extend(cell.getBoundingRectangle())
    })
  }

  render(): void {

  }
}