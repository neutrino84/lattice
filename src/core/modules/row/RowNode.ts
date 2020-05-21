import RowManager from '../row/RowManager'
import RowComponent from '../../components/RowComponent'
import CellComponent from '../../components/CellComponent'
import Node from '../Node'

export default class RowNode extends Node {
  data: any
  manager: RowManager
  component: RowComponent
  cells: CellComponent[] = []

  constructor(manager: RowManager, data: any) {
    super()

    this.manager = manager
    this.data = data

    // create row component and mount
    this.component = new RowComponent()
    this.component.mount(manager.component.el)
    this.component.attributes({
      style: {
        height: manager.options.row.height + 'px'
      }
    })

    // create cell components
    this.manager.options.definitions.forEach((definition) => {
      this.cells.push(new CellComponent(data[definition.field]))
    })

    // mount cell components
    this.cells.forEach((cell, index) => {
      let definition = manager.options.definitions[index]
      let height = manager.options.row.height || 20
      let width = definition.width || 120
      let left = width * index

      cell.mount(this.component.el)
      cell.attributes({
        style: {
          width: width + 'px',
          height: height + 'px',
          left: left + 'px',
        }
      })
    })
  }

  render(): void {

  }
}