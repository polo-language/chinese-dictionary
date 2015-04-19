var express = require('express')
  , path = require('path')
  , DictEntry = require('../models/dictionaryModel').DictEntry

module.exports = {
  addRoutes: addRoutes
}

function addRoutes(app) {
  app.set('view engine', 'jade')

  app.use(express.static(path.join(__dirname, '..', 'client')))

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/api/random/:count', [getRandom, sendResults])
  app.get('/api/search/:lang/:term', [getLangTerm, sendResults])
}

//// functions
function getRandom(req, res, next) {
  // TODO: currently gets first count entries.
  //       Rewrite to get count _random_ entries.
  var done = queryReturned.bind(this, req, next)
    , count = req.params.count
  if (count < 1) {
    count = 1
  } else if (10000 < count) {
    count = 10000
  }

  DictEntry.getRandom(count, done)
  // DictEntry.find({})
  //          .limit(count)
  //          .exec(done)
}

function getLangTerm(req, res, next) {
  var done = queryReturned.bind(this, req, next)
  switch (req.params.lang) {
  case 'english':
    DictEntry.searchEnglish(req.params.term, done)
    break;
  case 'chinese':
    DictEntry.searchChinese(req.params.term, done)
    break;
  case 'pinyin':
    DictEntry.searchPinyin(req.params.term, done)
    break;
  default:
    done(new Error('Invalid language in search parameter.'), undefined)
  }

}

function queryReturned(req, next, err, result) {
  req.err = err
  req.result = result
  next()
}

function sendResults(req, res) {
  if (req.err) {
    res.sendStatus(204)
    // TODO: notify of error
  }
  res.send(req.result)
}
