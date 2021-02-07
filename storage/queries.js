const DictEntry = require('./dictionaryModel').DictEntry

module.exports = {
  getRandom,
  getLangTerm,
}

function getRandom(req, res, next) {
  let count = req.params.count
  if (count < 1) {
    count = 1
  } else if (10000 < count) {
    count = 10000
  }

  DictEntry.getRandom(count, requestWrappingCallback(req, next))
}

function getLangTerm(req, res, next) {
  const done = requestWrappingCallback(req, next)
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

function requestWrappingCallback(req, next) {
  return (err, result) => {
    req.err = err
    req.result = result
    next()
  }
}
