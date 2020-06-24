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
          left: left + 'px',
          width: definition.width + 'px',
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
  dragResizeStartColumnNodes(key: string, delta: number): void {
    this.resizeColumnNodes(key, delta, false)
  }

  /*
   *
   */
  dragResizeEndColumnNodes(key: string, delta: number): void {
    this.resizeColumnNodes(key, delta, true)
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
  resizeColumnNodes(key: string, delta: number, persist: boolean = false): void {
    let nodes
    let manager = this.manager
    let row = manager.row
    if (row) {
      nodes = row.nodes.slice(0) as any[]
      nodes.push(this)
      nodes.forEach((node) => {
        let cells, definition, left, width
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
                if (node.component) {
                  node.component.attributes({
                    style: {
                      width: (node.bounds.width + delta) + 'px',
                    }
                  })
                }
                if (persist) {
                  cell.width = width
                  definition.width = width
                }
              }
              cells.slice(index+1).forEach((cell: any) => {
                if (cell.left != undefined) {
                  left = cell.left + delta
                  cell.attributes({
                    style: {
                        left: left + 'px'
                    }
                  })
                  if (persist) {
                    cell.left = left
                  }
                }
              })
            }
          })
        }
        if (persist) {
          node.bounds.width += delta
        }
      })
      if (persist && manager.scroll) {
        manager.scroll.viewport.width += delta
      }
    }
    if (persist) {
      RowNode.pool.clear()
      RowNode.cache.clear()
    }
  }
}