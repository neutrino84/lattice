import ColumnManager from '../column/ColumnManager'
import ColumnCellComponent from '../../components/ColumnCellComponent'
import { ColumnDefinition } from '../..'

export default class ColumnNode {
  public index: number
  public width: number
  public manager: ColumnManager
  public component: ColumnCellComponent
  public definition: ColumnDefinition

  constructor(manager: ColumnManager, definition: ColumnDefinition) {
    this.manager = manager
    this.definition = definition
    this.width = definition.width
    this.index = manager.options.definitions.indexOf(definition)

    // create column row component and mount
    this.component = new ColumnCellComponent(this)
    this.component.update(definition.name)
    this.component.mount(manager.component.el)
    this.component.attributes({
      style: {
        left: manager.component.bounds.width + 'px',
        width: definition.width + 'px',
      }
    })
  }
}