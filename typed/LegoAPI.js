const ChainedMap = require('./ChainedMap')
const ChainedSet = require('./ChainedSet')
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
    this.result = new ChainedSet(this.className)
    this.conditionals = new ChainedSet(this.className)

    // defaults, configurable
    this
      .debug(false)
      .startRegex()
      .endRegex()
      .splitRegex()
  }

  // --- configurable --- (needs docs)

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
    const {startRegex, endRegex, splitRegex} = this.entries()

    // console.log({startRegex, endRegex, splitRegex})

    return this
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
        this.result.add(line)
      }
    }
    else {
      this.result.add(line)
    }

    return this
  }

  toString(): string {
    return this.result.values().join('\n')
  }
}

LegoAPI.LegoAPI = LegoAPI
module.exports = LegoAPI
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', {value: true})
