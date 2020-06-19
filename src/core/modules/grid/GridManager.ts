import Core from '../..'
import Module from '../Module'
import ColumnManager from '../column/ColumnManager'
import RowManager from '../row/RowManager'
import ScrollManager from '../scroll/ScrollManager'
import RootComponent from '../../components/RootComponent'
import HeaderComponent from '../../components/HeaderComponent'
import FooterComponent from '../../components/FooterComponent'
import GridComponent from '../../components/GridComponent'

export default class GridManager extends Module {
  public root: RootComponent
  public header: HeaderComponent
  public component: GridComponent
  public footer: FooterComponent

  public row: RowManager | undefined
  public column: ColumnManager | undefined
  public scroll: ScrollManager | undefined

  /*
   *
   */
  constructor(core: Core) {
    super(core)

    this.root = new RootComponent(core.root)
    this.header = new HeaderComponent()
    this.component =  new GridComponent()
    this.footer = new FooterComponent()

    this.header.mount(core.root)
    this.component.mount(core.root)
    this.footer.mount(core.root)
  }

  /*
   *
   */
  public init(): void {
    super.init()

    // listen to grid scroll event
    this.component.on('scroll', this.onscroll.bind(this))

    // column module reference
    this.row = this.core.registry.get<RowManager>('RowManager')
    this.column = this.core.registry.get<ColumnManager>('ColumnManager')
    this.scroll = this.core.registry.get<ScrollManager>('ScrollManager')
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
    let root = this.root
    let component = this.component
    let header = this.header
    let footer = this.footer
    root.resize()
    if (this.column) {
      column = this.column
      header.resize(column.component.bounds.height)
      component.resize(root.bounds.height - footer.bounds.height - column.component.bounds.height)
      component.bounds.width = column.component.bounds.width
    } else {
      component.resize(root.bounds.height)
    }
  }

  /*
   *
   */
  public onscroll(): void {
    // header column row and grid left/right
    // must have linked scrolling behavior
    this.header.el.scrollLeft = this.component.el.scrollLeft
  }

  /*
   *
   */
  public destroy(): void {
    super.destroy()

    this.root.destroy()
    this.header.destroy()
    this.component.destroy()
    this.footer.destroy()

    delete this.root
    delete this.header
    delete this.component
    delete this.footer
    delete this.row
    delete this.column
    delete this.scroll
  }
}