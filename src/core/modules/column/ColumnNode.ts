import ColumnManager from '../column/ColumnManager'
import ColumnCellComponent from '../../components/ColumnCellComponent'
import { ColumnDefinition } from '../..'

export default class ColumnNode {
  public index: number
  public width: number
  public height: number
  public manager: ColumnManager
  public component: ColumnCellComponent
  public definition: ColumnDefinition

  constructor(manager: ColumnManager, definition: ColumnDefinition) {
    this.manager = manager
    this.definition = definition
    this.index = manager.options.definitions.indexOf(definition)
    this.height = manager.options.row.height || 20
    this.width = definition.width || 120
  
    // create column row component and mount
    this.component = new ColumnCellComponent(definition.name)
    this.component.mount(manager.component.el)
    this.component.attributes({
      style: {
        left: this.index * this.width + 'px',
        height: this.height + 'px',
      }
    })
  }
}