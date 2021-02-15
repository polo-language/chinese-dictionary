import { DictEntry } from './dictionaryModel.js'

export {
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
  DictEntry.getRandom(count)
  .then(array => {
    req.result = array.filter(v => v.value).map(v => v.value)
    // TODO: Log any unsuccessful values.
  })
  .catch(err => req.err = err)
  .finally(() => next())
}

function getLangTerm(req, res, next) {
  new Promise((resolve, reject) => {
    if (req.params.lang === 'english') {
      resolve(DictEntry.searchEnglish(
          req.params.term, req.query.wholeword, req.query.exactmatch))
    } else if (req.params.lang === 'chinese') { // TODO: wholeword here
      resolve(DictEntry.searchChinese(req.params.term))
    } else if (req.params.lang === 'pinyin') {
      resolve(DictEntry.searchPinyin(req.params.term))
    } else {
      reject(`Invalid search language '${req.params.lang}'`)
    }
  })
  .then(val => req.result = val)
  .catch(err => req.err = err)
  .finally(() => next())
}
