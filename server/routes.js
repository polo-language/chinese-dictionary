var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , DictEntry = require('../models/dictionaryModel').DictEntry
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
    // TODO: currently gets first count entries.
    //       Rewrite to get count _random_ entries.
    var count = req.params.count
    if (count < 1) {
      count = 1
    } else if (10000 < count) {
      count = 10000
    }
    
    DictEntry.find({})
             .limit(count)
             .exec(sendResults)

    function sendResults(err, result) {
      if (err) {
        res.sendStatus(204)
      }
      res.send(result)
    }
  })

  app.get('/api/search/en/:term', function (req, res) {
    // TODO: change 'en' to ':lang' and use a switch or pass to generic searchLang func in model
    DictEntry.searchEnglish(req.params.term, function (err, result) {
      if (err) {
        res.sendStatus(204)
      }
      res.send(result)
    })
  })
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
