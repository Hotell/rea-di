import { Logger } from './logger.service'

const styles = `
  color: blue;
  background-color: yellow;
  font-size: large
`

export class EnhancedLogger implements Logger {
  log(...args: any[]) {
    this.enhancedLog(...args)
  }
  warn(...args: any[]) {
    this.enhancedLog(...args)
  }
  error(...args: any[]) {
    this.enhancedLog(...args)
  }

  private enhancedLog(...args: any[]) {
    console.log('%c%s', styles, ...args)
  }
}
