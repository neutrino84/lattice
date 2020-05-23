import Node from '../Node'
import RowManager from '../row/RowManager'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'

export type RowOptions = {
  data: any
  manager: RowManager
}

export default class RowNode extends Node {
  public static DEFAULT_WIDTH = 180
  public data: any
  public manager: RowManager
  public component: RowComponent
  public cells: CellComponent[] = []

  constructor(options: RowOptions) {
    super()

    this.manager = options.manager
    this.data = options.data

    // create row component and mount
    this.component = new RowComponent()
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
    this.manager.options.definitions.forEach((definition) => {
      let cells = this.cells
      let value = this.data[definition.field]
      let cell = new CellComponent(value)

      cells.push(cell)
    })

    // mount cell components
    this.cells.forEach((cell, index) => {
      let manager = this.manager
      let left = this.bounds.width
      let definition = manager.options.definitions[index]
      let width = definition.width || RowNode.DEFAULT_WIDTH

      // configure cell
      cell.mount(this.component.el)
      cell.attributes({
        style: {
          width: width + 'px',
          left: left + 'px',
        }
      })

      // extend row bounds
      this.bounds.extend(cell.getBoundingRectangle())
    })
  }
}