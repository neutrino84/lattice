
import Core from '../..'
import Module from '../Module'
import GridComponent from '../../components/GridComponent'

export default class GridManager extends Module {
  component: GridComponent

  constructor(core: Core) {
    super(core)

    this.component = new GridComponent()
  }

  destroy(): void {
    this.component.destroy()
    delete this.component
  }
}