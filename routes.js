const express = require('express')
const DictEntry = require(__dirname + '/models/dictionaryModel').DictEntry

module.exports = {
  addRoutes,
}

function addRoutes(app) {
  app.set('view engine', 'pug')
  app.set('views', __dirname + '/views')

  app.use(express.static(__dirname + '/client'))

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/api/random/:count', [getRandom, sendResults])
  app.get('/api/search/:lang/:term', [getLangTerm, sendResults])
}

//// functions
function getRandom(req, res, next) {
  let count = req.params.count
  if (count < 1) {
    count = 1
  } else if (10000 < count) {
    count = 10000
  }

  DictEntry.getRandom(count, queryReturned.bind(this, req, next))
}

function getLangTerm(req, res, next) {
  const done = queryReturned.bind(this, req, next)
  switch (req.params.lang) {
  case 'english':
    DictEntry.searchEnglish(req.params.term, req.query.wholeword, req.query.exactmatch, done)
    break;
  case 'chinese': // TODO: wholeword here
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
