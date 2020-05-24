import Core from '../..'
import Module from '../Module'
import Rectangle from '../../../geometry/Rectangle'
import ColumnManager from '../column/ColumnManager'

export type GridBoundaries = {
  root?: Rectangle
  grid?: Rectangle
}

export default class GridManager extends Module {
  column: ColumnManager | undefined
  boundaries: GridBoundaries = {}

  /*
   *
   */
  constructor(core: Core) {
    super(core)

    this.core.grid.on('scroll', this.onscroll.bind(this))
  }

  /*
   *
   */
  public init(): void {
    super.init()

    // manager references
    this.column = this.core.registry.get<ColumnManager>('ColumnManager')
  }

  /*
   *
   */
  public mount(): void {
    this.resize()
  }

  /*
   *
   */
  public resize(): void {
    let height
    let core = this.core
    let column = this.column
    let boundaries = this.boundaries
    let root = boundaries.root = new Rectangle(core.root.getBoundingClientRect())

    if (column) {
      height = root.height - column.bounds.height
      core.grid.attributes({
        style: {
          height: height + 'px'
        }
      })
      boundaries.grid = core.grid.getBoundingRectangle()
    } else {
      core.grid.attributes({
        style: {
          height: root.height + 'px'
        }
      })
      boundaries.grid = root
    }
  }

  /*
   *
   */
  public onscroll(): void {
    if (this.column) {
      this.core.header.el.scrollLeft = this.core.grid.el.scrollLeft
    }
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()
  }
}