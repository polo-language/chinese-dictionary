var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , dictPath = './res/dict-json/dict_all.json'
  , dict = JSON.parse(fs.readFileSync(dictPath, { encoding: 'utf8' }))

module.exports = {
  addRoutes: addRoutes
}

function addRoutes(app) {
  app.set('view engine', 'jade')

  app.use(express.static(path.join(__dirname, '..', 'client')))

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/api/random/:count', function (req, res) {
    var count = req.params.count
    if (count < 1) {
      count = 1
    } else if (10000 < count) {
      count = 10000
    }
    res.send(randomKeys(dict, count))
  })

  // app.get('/api/search/en/:term', function (req, res) {
  //   // TODO
  // })
}

//// functions
function randomKeys(obj, count) {
  var keys = Object.keys(obj)
    , selected = {}
    , key
  for (var i = 0; i < count; ++i) {
    key = keys[Math.floor(keys.length * Math.random())]
    selected[key] = obj[key]
  }
  return selected
}
