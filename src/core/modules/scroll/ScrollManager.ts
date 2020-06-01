
import Core from '../..'
import Module from '../Module'
import Rectangle from '../../../geometry/Rectangle'
import GridManager from '../../modules/grid/GridManager'
import RowManager from '../row/RowManager'

export default class ScrollManager extends Module {
  private static LOOK_AHEAD_FACTOR = 2
  private static LOOK_AHEAD_BUFFER_SIZE = 256
  private static DEBOUNCE_TIMEOUT_MS = 50

  public bounds: Rectangle = new Rectangle()
  public viewport: Rectangle = new Rectangle()

  private debounce: NodeJS.Timeout | undefined
  private grid: GridManager | undefined
  private row: RowManager | undefined

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
        node.cull()
        if (viewport.contains(node.bounds)) {
          node.uncull()
        }
      })
    }
  }

  /*
   *
   */
  public onscroll(): void {
    // update boundary
    this.viewport.y = this.bounds.y + this.core.grid.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE
  
    // update scroll
    if (!this.debounce) {
      this.scroll()
      this.debounce = setTimeout(() => {
        this.scroll()
        this.debounce = undefined
      }, ScrollManager.DEBOUNCE_TIMEOUT_MS)
    }
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()

    delete this.grid
    delete this.row
  }
}