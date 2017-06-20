const test = require('ava')
const LegoAPI = require('../')

const contents = `
  /* @if lazyLoading | server | coolio */
    function aj(url, cb) {
        /* @if browser && true */
          /* @if browser || true */
            var f = window.fetch;
            if (f) return f(url).then(function(res) { return res.text().then(function(data) { cb(null, data) }) }).catch(cb)
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4) {
                    cb(this.status == 200 ? 0 : 1, this.responseText);
                }
            };
          /* @end */

        /* @if browser */
          /* @if true */
            /* @if true */
              /* @if true */
                /* @if true */
                  /* @if true */
                    OOGALIEBOOGALIE
                  /* @end */
                /* @end */
              /* @end */
            /* @end */
          /* @end */
        /* @end */
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();
        /* @end */

        /* @if server */
        cb(null, require(url));
        /* @end */
    }


    var bMapping = $bundleMapping$;
    $fsx.l = function(id) {
        return new Promise((resolve, reject) => {
            if (bMapping.i && bMapping.i[id]) {
                var data = bMapping.i[id];
                aj(bMapping.c.b + data[0], function(err, result) {
                    if (!err) {
                        new Function(result)();
                        resolve($fsx.r(data[1]));
                    }
                });
            } else {
                aj(id, function(err, result) {
                    if (!err) {
                        var fn = new Function('module', 'exports', result);
                        var moduleExports = {};
                        var moduleObject = { exports: moduleExports };
                        fn(moduleObject, moduleExports)
                        resolve(moduleObject.exports);
                    }
                });
            }
        });
    }

    /* @end */
    /** ********************************************  */
`
test('can evaluate', t => {
  const lego = new LegoAPI()
  const rendered = lego.debug(false).parse(contents).render({
    lazyLoading: false,
    coolio: true,
    server: true,
    browser: true,
    universal: false,
  })
  console.log(rendered + '')
  t.true(rendered.includes('var f = window.fetch;'))
  t.true(rendered.includes('OOGALIEBOOGALIE'))
})

test('strips empty', t => {
  const contentsWithEmpty = `
/* @if true */


1

2

3



4

/* @end */


`
  const expected = `
1
2
3
4
`
  const lego = new LegoAPI()
  const rendered = lego.debug(false).parse(contentsWithEmpty).render({})
  console.log(rendered + '')
  t.true(rendered == expected.trim())
})

// need to capture output to do this
test.todo('can use debug')
