/**
 * @type {Chainable}
 * @property {Chainable | any} parent
 */
class Chainable {
  /**
   * @param {Chainable | any} parent
   */
  constructor(parent: Chainable | any) {
    this.parent = parent
  }

  /**
   * @since 0.4.0
   * @see Chainable.parent
   * @return {Chainable | any}
   */
  end(): Chainable | any {
    return this.parent
  }

  /**
   * @since 0.5.0
   * @see ChainedMap.store & ChainedSet.store
   * @return {number}
   */
  get length(): number {
    return this.store.size
  }

  /**
   * @since 0.3.0
   * @return {Chainable}
   */
  clear(): Chainable {
    this.store.clear()
    return this
  }

  /**
   * @since 0.3.0
   * @description calls .delete on this.store.map
   * @param {string | any} key
   * @return {Chainable}
   */
  delete(key: any): Chainable {
    this.store.delete(key)
    return this
  }

  /**
   * @since 0.3.0
   * @param {any} value
   * @return {boolean}
   */
  has(value: any): boolean {
    return this.store.has(value)
  }
}

Chainable.Chainable = Chainable
module.exports = Chainable
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', {value: true})
