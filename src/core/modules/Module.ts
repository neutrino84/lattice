import Core from '../'

export default abstract class Module {
  core: Core

  constructor(core: Core) {
    this.core = core
  }

  init(): void {
    this.core.logger.log('successfully initilized ' + this.constructor.name + ' module')
  }

  mount(): void {
    //.. mount module components
  }

  mounted(): void {
    //.. logic once components are mounted
  }

  resize(): void {
    //.. resize modules components
  }

  destroy(): void {
    // delete this.core
  }
}