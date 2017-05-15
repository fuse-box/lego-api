const test = require('ava')
const LegoAPI = require('../')

test('can import', t => {
  t.true(new LegoAPI() instanceof LegoAPI)
})
