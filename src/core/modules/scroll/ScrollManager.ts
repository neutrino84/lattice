
import Core from '../..'
import Module from '../Module'
import Rectangle from '../../../geometry/Rectangle'
import ColumnManager from '../column/ColumnManager'
import GridManager from '../../modules/grid/GridManager'
import RowManager from '../row/RowManager'

export default class ScrollManager extends Module {
  private static LOOK_AHEAD_FACTOR = 2
  private static LOOK_AHEAD_BUFFER_SIZE = 128
  private static DEBOUNCE_TIMEOUT_MS = 50

  private debounce: NodeJS.Timeout | undefined
  private grid: GridManager | undefined
  private row: RowManager | undefined
  private column: ColumnManager | undefined

  public bounds: Rectangle = new Rectangle()
  public viewport: Rectangle = new Rectangle()

  constructor(core: Core) {
    super(core)
  }

  /*
   *
   */
  public init(): void {
    super.init()
  
    // manager module references
    this.column = this.core.registry.get<ColumnManager>('ColumnManager')
    this.grid = this.core.registry.get<GridManager>('GridManager')
    this.row = this.core.registry.get<RowManager>('RowManager')

    // listen to grid component scroll event
    this.grid && this.grid.component.on('scroll', this.onscroll, this)
  }

  public mount(): void {
    //..
  }

  /*
   *
   */
  public mounted(): void {
    if (this.grid) {
      // create bounds
      this.bounds = this.grid.component.bounds.clone()
      this.bounds.height *= ScrollManager.LOOK_AHEAD_FACTOR

      // create viewport
      this.viewport = this.grid.component.bounds.clone()
      this.viewport.height += ScrollManager.LOOK_AHEAD_BUFFER_SIZE * 2
      this.viewport.y = this.bounds.y + this.grid.component.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE
    }
  }

  /*
   *
   */
  public scroll(): void {
    if (this.grid) {
      // move viewport to scrolled position
      this.viewport.y = this.bounds.y + this.grid.component.el.scrollTop - ScrollManager.LOOK_AHEAD_BUFFER_SIZE

      // update row node culling
      if (this.row) {
        this.row.nodes.forEach((node) => {
          node.cull()
          if (this.viewport.contains(node.bounds)) {
            node.uncull()
          }
        })
      }
    }
  }

  /*
   *
   */
  public onscroll(): void {
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
    delete this.column
  }
}