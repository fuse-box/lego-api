// import deepmerge from 'deepmerge'
const isArr = Array.isArray
module.exports = function deepmerge(obj1, obj2) {
  const type1 = typeof obj1
  const type2 = typeof obj2
  const types = [type1, type2]

  if (['null', 'undefined', 'NaN'].includes(type1)) return obj2
  if (['null', 'undefined', 'NaN'].includes(type2)) return obj1

  switch (types) {
    case ['string', 'string']: return [obj1, obj2]
    case isArr(obj1) && type2 === 'string': return obj1.concat([obj2])
    case type1 === 'string' && isArr(obj2): return obj2.concat([obj1])
    default: return Object.assign(obj1, obj2)
  }
}
