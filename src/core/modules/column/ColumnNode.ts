import ColumnManager from '../column/ColumnManager'
import ColumnRowComponent from '../../components/ColumnRowComponent'
import ColumnCellComponent from '../../components/ColumnCellComponent'
import Rectangle from '../../../geometry/Rectangle'
import { ColumnDefinition } from '../..'
import RowNode from '../row/RowNode'

export type ColumnOptions = {
  definitions: ColumnDefinition[]
  manager: ColumnManager
  index: number
}

export default class ColumnNode {
  public manager: ColumnManager
  public index: number
  public definitions: ColumnDefinition[]

  public type = 'header'
  public component = new ColumnRowComponent(this)
  public bounds = new Rectangle()

  constructor(options: ColumnOptions) {
    this.manager = options.manager
    this.definitions = options.definitions
    this.index = options.index
  }

  public init(): void {
    //..
  }

  public mount(alignment: Rectangle): void {
    let manager = this.manager
    let definitions = this.definitions
    let component = this.component
    let bounds = this.bounds

    // mount component
    component.mount(manager.component.el)

    bounds.width = 0
    bounds.x = alignment.x
    bounds.y = alignment.y + alignment.height

    definitions.forEach((definition) => {
      let left = bounds.width
      let width = definition.width
      let cell = new ColumnCellComponent(this)

      // mount and style
      cell.left = left
      cell.width = width
      cell.definition = definition
      cell.update(definition.name)
      cell.mount(component.el)
      cell.attributes({
        style: {
          width: definition.width + 'px',
          left: left + 'px',
        }
      })

      // update node bounds
      bounds.extend(cell.getBoundingRectangle())

      // add cell to collection
      component.cells.push(cell)
    })

    // position node and
    // set style attributes
    component.attributes({
      style: {
        height: bounds.height + 'px',
        width: bounds.width + 'px',
      }
    })
  }

  resize(): void {
    //..
  }

  /*
   *
   */
  dragDropColumnNodes(): void {
    //..
  }

  /*
   *
   */
  dragResizeColumnNodes(key: string, delta: number): void {
    let nodes
    let manager = this.manager
    let row = manager.row
    if (row) {
      nodes = row.nodes.slice(0) as any[]
      nodes.push(this)
      nodes.forEach((node) => {
        let cells, definition
        let component = node.component
        let definitions = node.definitions
        if (component) {
          cells = component.cells
          cells.forEach((cell: any, index: any, cells: any) => {
            definition = definitions[index]
            if (key === definition.field) {
              if (cell.width != undefined) {
                cell.attributes({
                  style: {
                    width: (cell.width + delta) + 'px'
                  }
                })
              }
              cells.slice(index+1).forEach((cell: any) => {
                if (cell.left != undefined) {
                  cell.attributes({
                    style: {
                        left: cell.left + delta + 'px'
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  }

  dragEndColumnNodes(key: string, delta: number): void {
    let nodes
    let manager = this.manager
    let row = manager.row
    if (row) {
      nodes = row.nodes.slice(0) as any[]
      nodes.push(this)
      nodes.forEach((node) => {
        let cells, definition, width, left
        let component = node.component
        let definitions = node.definitions

        if (component) {
          cells = component.cells
          cells.forEach((cell: any, index: any, cells: any) => {
            definition = definitions[index]
            if (key === definition.field) {
              if (cell.width != undefined) {
                width = cell.width + delta
                cell.attributes({
                  style: {
                    width: width + 'px'
                  }
                })
                cell.width = width
                definition.width = width
              }
              cells.slice(index+1).forEach((cell: any) => {
                if (cell.left != undefined) {
                  left = cell.left + delta
                  cell.attributes({
                    style: {
                        left: left + 'px'
                    }
                  })
                  cell.left = left
                }
              })
            }
          })
        }
        node.bounds.width += delta
        node.component && node.component.attributes({
          style: {
            width: node.bounds.width + 'px',
          }
        })
      })
      if (manager.scroll) {
        manager.scroll.viewport.width += delta
      }
    }

    RowNode.pool.clear()
    RowNode.cache.clear()
  }
}