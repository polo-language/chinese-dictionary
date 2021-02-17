import { Response, NextFunction } from 'express'
import { Request } from '../expressTypes'
import { DictEntry, DictionaryDoc } from './dictionaryModel.js'
import { URLSearchParams } from 'url'

export {
  getRandom,
  getLangTerm,
}

function getRandom(req: Request, _res: Response, next: NextFunction) {
  console.log(`Query random -- count ${req.params.count}`)
  const count = parseCount(req.params.count)
  DictEntry.getRandom(count)
  .then(array => {
    if (array.length === 0) {
      console.warn(`Zero results for random count ${count}`);
    }
    return req.result = array
  })
  .catch(err => req.err = err)
  .finally(() => next())
}

function parseCount(countParam: string): number {
  const count = parseInt(countParam)
  if (count === NaN) {
    console.warn(`Invalid random entry count in request: '${countParam}'`)
    return 5
  }
  if (count < 1) {
      return 1
  }
  if (10000 < count) {
      return 10000
  }
  return count
}

function getLangTerm(req: Request, _res: Response, next: NextFunction) {
  console.log(`Query language -- lang ${req.params.lang} term '${req.params.term}'`)
  new Promise((resolve: (value: Promise<DictionaryDoc[]>) => void, reject) => {
    if (req.params.lang === 'english') {
      resolve(DictEntry.searchEnglish(
          req.params.term,
          stringToBool(getQueryParam(req.query, 'wholeword')),
          stringToBool(getQueryParam(req.query, 'exactmatch'))))
    } else if (req.params.lang === 'chinese') { // TODO: wholeword here
      resolve(DictEntry.searchChinese(req.params.term))
    } else if (req.params.lang === 'pinyin') {
      resolve(DictEntry.searchPinyin(req.params.term))
    } else {
      reject(`Invalid search language '${req.params.lang}'`)
    }
  })
  .then((array) => {
    if (array.length === 0) {
      console.warn(`Zero results for language ${req.params.lang}, term '${req.params.term}'`);
    }
    return req.result = array
  })
  .catch(err => req.err = err)
  .finally(() => next())
}

function getQueryParam(params: URLSearchParams, name: string): string | null {
  const value = params.get(name)
  if (value === null) {
    console.warn(`Null query param for name '${name}'`)
  }
  return value
}

function stringToBool(str: string | null) {
  return str ? str.toLowerCase() === 'true' : false
}
