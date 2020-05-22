type Level = 'error' | 'warn' | 'info'
export default class Logger {
  private enabled: boolean

  constructor(enabled: boolean) {
    this.enabled = enabled
  }

  public log(message: string, level: string = 'info') {
    if (this.enabled) {
      switch (level) {
        case 'info':
          console.info('%cnGrid: ' + message, 'color:#6699ff')
          break;
        case 'warn':
          console.info('%cnGrid: ' + message, 'color:#ffff66')
          break;
        case 'error':
          console.info('%cnGrid: ' + message, 'color:#ff3333')
          break;
      }
    }
  }
}