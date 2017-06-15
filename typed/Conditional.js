const { ChainedMap } = require('chain-able')

class Conditional extends ChainedMap {
  name(name: string): Conditional {
    return this.set('name', name.trim())
  }

  line(line: number): Conditional {
    return this.set('line', line)
  }

  isNested(): boolean {
    return this.parent !== null
  }

  /**
   * @desc get root parent,
   *       then split & check each name to ensure enabled,
   *       ...dun
   * @return {boolean}
   */
  isEnabled(): boolean {
    let parent = this.parent
    while (parent && parent.parent) {
      parent = parent.parent
    }

    const namespace = this.get('name').split('.')
    const enabled =
      namespace.filter(name => parent.get('conditions')[name]).length ===
      namespace.length

    return enabled
  }
}

Conditional.Conditional = Conditional
module.exports = Conditional
module.exports.default = module.exports
Object.defineProperty(module.exports, '__esModule', { value: true })
