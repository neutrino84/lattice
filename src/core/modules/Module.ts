import Core from '../'

export default abstract class Module {
  core: Core

  constructor(core: Core) {
    this.core = core
  }

  init(): void {
    this.core.logger.log('successfully initilized ' + this.constructor.name + ' module')
  }

  destroy(): void {
    delete this.core
  }
}