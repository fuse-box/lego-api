const { ChainedMap, ChainedSet } = require('chain-able')
const Conditional = require('./Conditional')

/**
 * @classdesc build on demand
 *            set conditionals, an object with keys to enable
 *            .start condition names, make into conditionals
 *            .add lines of code
 *            .end conditions
 */
class LegoAPI extends ChainedMap {
  // protected
  conditionals: ChainedSet
  result: ChainedSet
  current: undefined | false | Conditional

  // --- construct/setup ---

  static init(conditions: Object) {
    return new LegoAPI().conditions(conditions)
  }
  static parse(contents: string) {
    return LegoAPI.init().parse(contents)
  }

  constructor(parent: any) {
    super(parent)

    // setup the children, just tell them the className for debugging
    this.result = ``
    this.conditionals = new ChainedSet(this.className)

    // defaults, configurable
    this.debug(false).startRegex().endRegex().splitRegex()
  }

  // --- configurable --- (needs docs)

  log(text) {
    if (this.get('debug')) {
      console.log(text)
    }
    return this
  }
  debug(should = true) {
    return this.set('debug', should)
  }
  startRegex(startRegex = /^\s*\/\*\s*@if\s([\w]+)+\s*\*\//): LegoAPI {
    return this.set('startRegex', startRegex)
  }
  endRegex(endRegex = /^\s*\/\*\s*@end\s*\*\//): LegoAPI {
    return this.set('endRegex', endRegex)
  }
  splitRegex(splitRegex = /\r?\n/): LegoAPI {
    return this.set('splitRegex', splitRegex)
  }

  // --- data --- (needs docs)

  conditions(conditions: Object): LegoAPI {
    return this.set('conditions', conditions)
  }
  parse(contents: string): LegoAPI {
    return this.set('contents', contents)
  }

  // --- handle ---

  render(conditions: Object): string {
    const lego = this.conditions(conditions)
    const { startRegex, endRegex, splitRegex } = this.entries()

    this.log({ startRegex, endRegex, splitRegex })

    return lego
      .get('contents')
      .split(splitRegex)
      .map(line => {
        const startIf = line.match(startRegex)
        const endIf = line.match(endRegex)
        if (!startIf && !endIf) return lego.add(line)
        if (startIf) return lego.start(startIf[1])
        if (endIf) return lego.end()
      })
      .pop()
      .toString()
  }

  // --- operations ---

  /**
   * @desc when we have a current conditional, append the new name
   *       otherwise, use the provided conditional
   *       @modifies this.current
   *       @modifies this.conditionals
   * @see Conditional.isEnabled&.name
   * @param  {string} name
   * @return {LegoAPI} @chainable
   */
  start(name: string): LegoAPI {
    let namespace = name
    if (this.current) {
      namespace = this.current.get('name') + '.' + name
    }

    this.log('starting condition: ' + namespace)
    const condition = new Conditional(this.current || this)
    condition.name(namespace)

    this.current = condition
    this.conditionals.add(condition)

    return this
  }

  /**
   * @desc calls .end on this.current,
   *       when it has a parent, go back up,
   *       otherwise, null
   *       @modifies this.current
   * @param  {string} name
   * @return {LegoAPI} @chainable
   */
  end(name: string): LegoAPI {
    this.current = this.current.end()
    if (this.current === this) this.current = false

    this.log('ending current condition')

    return this
  }

  /**
   * @desc when there is a conditional... check it
   *       when no conditional...
   *       Unconditional Love...
   *       is a condition outside of all conditions
   *
   * @param  {string} line
   * @return {LegoAPI} @chainable
   */
  add(line: string): LegoAPI {
    if (this.current) {
      if (this.current.isEnabled()) {
        this.log('line is enabled, adding: ', line)
        this.result += line + '\n'
      } else {
        this.log('line is not enabled: ' + line)
      }
    } else {
      this.log('adding line, no current: ' + line)
      this.result += line + '\n'
    }

    return this
  }

  toString(): string {
    return this.result.replace(/(\n{3})+/gm, '\n')
  }
}

LegoAPI.LegoAPI = LegoAPI
module.exports = LegoAPI
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', { value: true })
