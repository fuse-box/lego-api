const Chainable = require('./Chainable')

class ChainedMap extends Chainable {
  store: Map

  /**
   * @param {ChainedMap | Chainable | any} parent
   */
  constructor(parent: ChainedMap | Chainable | any) {
    super(parent)
    this.store = new Map()
    this.className = this.constructor.name
  }

  /**
   * checks each property of the object
   * calls the chains accordingly
   *
   * @param {Object} obj
   * @return {Chainable}
   */
  from(obj: Object) {
    Object.keys(obj).forEach(key => {
      const fn = this[key]
      const value = obj[key]

      if (this[key] && this[key] instanceof Chainable) {
        return this[key].merge(value)
      }
      else if (typeof this[key] === 'function') {
        return this[key](value)
      }
      else {
        this.set(key, value)
      }
    })
    return this
  }

  /**
   * @description
   *   clears the map,
   *   goes through this properties,
   *   calls .clear if they are instanceof Chainable or Map
   *
   * @return {ChainedMap}
   */
  clear(): ChainedMap {
    this.store.clear()
    Object.keys(this).forEach(key => {
      if (key === 'inspect') return
      if (this[key] instanceof Chainable) this[key].clear()
      if (this[key] instanceof Map) this[key].clear()
    })
    return this
  }

  /**
   * @description spreads the entries from ChainedMap.store (Map)
   * @return {Object}
   */
  entries(): Object {
    const entries = [...this.store]
    if (!entries.length) {
      return null
    }
    return entries.reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
  }

  /**
   * @description spreads the entries from ChainedMap.store.values
   * @return {Array<any>}
   */
  values(): Array<any> {
    return [...this.store.values()]
  }

  /**
   * @param  {any} key
   * @return {any}
   */
  get(key: any): any {
    return this.store.get(key)
  }

  /**
   * @description sets the value using the key on store
   * @see ChainedMap.store
   * @param {any} key
   * @param {any} value
   * @return {ChainedMap}
   */
  set(key: string | int | any, value: any): ChainedMap {
    this.store.set(key, value)
    return this
  }

  /**
   * @description concats an array `value` in the store with the `key`
   * @see ChainedMap.store
   * @param {any} key
   * @param {Array<any>} value
   * @return {ChainedMap}
   */
  concat(key: string | int | any, value: any): ChainedMap {
    if (!Array.isArray(value)) value = [value]
    this.store.set(key, this.store.get(value).concat(value))
    return this
  }

  /**
   * @description appends the string value to the current value at the `key`
   * @see ChainedMap.concat
   * @param {any} key
   * @param {string | Array} value
   * @return {ChainedMap}
   */
  append(key: any, value: Array | string): ChainedMap {
    let existing = this.store.get(value)

    if (Array.isArray(existing)) {
      existing.push(value)
    }
    else {
      existing += value
    }

    this.store.set(key, existing)

    return this
  }

  /**
   * @description merges an object with the current store
   * @see deepmerge
   * @param {Object} obj
   * @return {ChainedMap}
   */
  merge(obj: Object): ChainedMap {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (this[key] && this[key] instanceof Chainable) {
        return this[key].merge(value)
      }

      if (this.shorthands.includes(key)) {
        const existing = this.get(key)
        if (existing) {
          const merged = deepmerge(existing, value)
          return this[key](merged)
        }

        return this[key](value)
      }

      return this.set(key, value)
    })

    return this
  }

  /**
   * @description
   *  goes through the maps,
   *  and the map values,
   *  reduces them to array
   *  then to an object using the reduced values
   *
   * @param {Object} obj
   * @return {Object}
   */
  clean(obj: Object): Object {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]
      if (value === undefined) return acc
      if (Array.isArray(value) && !value.length) return acc
      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        Object.keys(value).length === 0
      ) {
        return acc
      }

      acc[key] = value

      return acc
    }, {})
  }

  /**
   * @description
   *  when the condition is true,
   *  trueBrancher is called,
   *  else, falseBrancher is called
   *
   * @param  {boolean} condition
   * @param  {Function} [trueBrancher=Function.prototype]
   * @param  {Function} [falseBrancher=Function.prototype]
   * @return {ChainedMap}
   */
  when(
    condition,
    trueBrancher = Function.prototype,
    falseBrancher = Function.prototype
  ) {
    if (condition) {
      trueBrancher(this)
    }
    else {
      falseBrancher(this)
    }

    return this
  }
}

ChainedMap.ChainedMap = ChainedMap
module.exports = ChainedMap
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', {value: true})
