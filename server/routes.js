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

  app.get('/api/search/:lang/:term', function (req, res) {
    switch (req.params.lang) {
    case 'english':
      DictEntry.searchEnglish(req.params.term, handleResults)
      break;
    case 'chinese':
      DictEntry.searchChinese(req.params.term, handleResults)
      break;
    case 'pinyin':
      DictEntry.searchPinyin(req.params.term, handleResults)
      break;
    default:
      return notifyError(new Error('Invalid language in search parameter.'))
    }

    function handleResults(err, result) {
      if (err) { return notifyError(err); }
      res.send(result)
    }

    function notifyError(err) {
        res.sendStatus(204)
        // TODO notify of error
    }
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
