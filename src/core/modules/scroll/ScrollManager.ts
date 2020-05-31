
import Core from '../..'
import Module from '../Module'
import Rectangle from '../../../geometry/Rectangle'
import GridManager from '../../modules/grid/GridManager'
import RowManager from '../row/RowManager'

export default class ScrollManager extends Module {
  private static LOOK_AHEAD_FACTOR = 2
  private static LOOK_AHEAD_BUFFER_SIZE = 512
  private static DEBOUNCE_TIMEOUT_MS = 50

  debounce: NodeJS.Timeout | undefined
  grid: GridManager | undefined
  row: RowManager | undefined
  bounds: Rectangle = new Rectangle()
  viewport: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)

    this.core.grid.on('scroll', this.onscroll, this)
  }

  /*
   *
   */
  public init(): void {
    super.init()
  
    // manager references
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.row = this.core.registry.get<RowManager>('RowManager')
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
    let grid = this.grid
    if (grid && grid.boundaries.grid) {
      // create bounds
      this.bounds = grid.boundaries.grid.clone()
      this.bounds.height *= ScrollManager.LOOK_AHEAD_FACTOR

      // create viewport
      this.viewport = grid.boundaries.grid.clone()
      this.viewport.height += ScrollManager.LOOK_AHEAD_BUFFER_SIZE * 2
      this.viewport.y = this.bounds.y + this.core.grid.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE
    }
  }

  /*
   *
   */
  public scroll(): void {
    let row = this.row
    let viewport = this.viewport
  
    // move visible boundary
    this.viewport.y = this.bounds.y + this.core.grid.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE

    if (row) {
      row.nodes.forEach((node) => {
        if (viewport.contains(node.bounds)) {
          node.show()
        } else {
          node.hide()
        }
      })
    }

    // reset debounce
    this.debounce = undefined
  }

  /*
   *
   */
  public onscroll(): void {
    // move visible boundary
    this.viewport.y = this.bounds.y + this.core.grid.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE
  
    // update node visibiliy
    if (!this.debounce) {
      this.debounce = setTimeout(this.scroll.bind(this), ScrollManager.DEBOUNCE_TIMEOUT_MS)
    }
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()
  }
}