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
    // get root bounding box
    this.boundaries.root = new Rectangle(this.core.root.getBoundingClientRect())

    // get grid bounding box
    if (this.column) {
      this.core.grid.attributes({
        style: {
          height: (this.boundaries.root.height - this.column.bounds.height) + 'px'
        }
      })
      this.boundaries.grid = this.core.grid.getBoundingRectangle()
    } else {
      this.core.grid.attributes({
        style: {
          height: this.boundaries.root.height + 'px'
        }
      })
      this.boundaries.grid = this.boundaries.root
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