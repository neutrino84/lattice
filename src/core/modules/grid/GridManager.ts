import Core from '../..'
import Module from '../Module'
import Rectangle from '../../../geometry/Rectangle'
import ColumnManager from '../column/ColumnManager'

type GridBoundaries = {
  root: Rectangle
  grid: Rectangle
}

export default class GridManager extends Module {
  column: ColumnManager | undefined
  boundaries: GridBoundaries = {
    root: new Rectangle(),
    grid: new Rectangle(),
  }

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
    let column
    let core = this.core
    let boundaries = this.boundaries

    boundaries.root = new Rectangle(core.root.getBoundingClientRect())

    if (this.column) {
      column = this.column
      core.grid.attributes({
        style: {
          height: (boundaries.root.height - column.bounds.height) + 'px'
        }
      })
      boundaries.grid = core.grid.getBoundingRectangle()
      
      if (column.bounds.width > boundaries.grid.width) {
        boundaries.grid.width = column.bounds.width
      }
    } else {
      core.grid.attributes({
        style: {
          height: boundaries.root.height + 'px'
        }
      })
      boundaries.grid = boundaries.root
    }
  }

  /*
   *
   */
  public onscroll(): void {
    this.core.header.el.scrollLeft = this.core.grid.el.scrollLeft
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()
  }
}