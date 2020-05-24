import Core from '../..'
import Module from '../Module'

export default class GridManager extends Module {
  constructor(core: Core) {
    super(core)

    // subscribe listeners
    this.core.on('column:nodes:created', this.resize, this)
  }

  /*
   *
   */
  public init(): void {
    super.init()
  }

  /*
   *
   */
  public resize(): void {
    let core = this.core
    let rrect = core.root.getBoundingClientRect()
    let hrect = core.header.getBoundingRectangle()
    let frect = core.footer.getBoundingRectangle()
    let height = rrect.height - frect.height - hrect.height

    core.grid.attributes({
      style: {
        height: height + 'px'
      }
    })
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()
  }
}