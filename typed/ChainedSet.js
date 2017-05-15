const Chainable = require('./Chainable')

/**
 * @type {Set}
 */
class ChainedSet extends Chainable {

  /**
   * @param {ChainedSet | Chainable | any} parent
   */
  constructor(parent: ChainedSet | Chainable | any) {
    super(parent)
    this.store = new Set()
  }

  /**
   * @param {any} value
   * @return {ChainedSet}
   */
  add(value: any): ChainedSet {
    this.store.add(value)
    return this
  }

  /**
   * @description inserts the value at the beginning of the Set
   * @param {any} value
   * @return {ChainedSet}
   */
  prepend(value: any): ChainedSet {
    this.store = new Set([value, ...this.store])
    return this
  }

  /**
   * @return {Array<any>}
   */
  values() {
    return [...this.store]
  }

  /**
   * @param {Array | Set} arr
   * @return {ChainedSet}
   */
  merge(arr) {
    this.store = new Set([...this.store, ...arr])
    return this
  }
}

ChainedSet.ChainedSet = ChainedSet
module.exports = ChainedSet
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', {value: true})
