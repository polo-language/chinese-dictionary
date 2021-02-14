import mongoose from 'mongoose'

const COLLECTION_NAME = 'DictEntries'

const dictSchema = new mongoose.Schema({
  key: Number,
  trad: String,
  simp: String,
  pinyin: String,
  english: [String],
  showingAltEnglish: { type: Boolean, default: false }
})
dictSchema.statics.getRandom = getRandom
dictSchema.statics.searchEnglish = searchEnglish
dictSchema.statics.searchChinese = searchChinese
dictSchema.statics.searchPinyin = searchPinyin

export const DictEntry =
    mongoose.model('DictEntry', dictSchema, COLLECTION_NAME)

/**
 * @param {number} count
 * @return {Promise<Array>}
 */
function getRandom(count) {
  return this.find()
      .estimatedDocumentCount()
      .then(total => Promise.allSettled(
          getRandomKeys(count, total).map(oneKey =>
              this.findOne({ key: oneKey }).exec())))
}

function getRandomKeys(count, total) {
  const keys = new Set()
  while (keys.size < count) {
    keys.add(randomInteger(0, total))
  }
  return Array.from(keys)
}

function randomInteger(min, max) {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)
  return Math.floor(minInt + (maxInt - minInt) * Math.random())
}

function searchEnglish(term, wholeword, exactmatch) {
  return this.find({ english: englishRegexFor(term, wholeword, exactmatch) })
      .sort({ english: 'asc' })
      .exec()
}

function englishRegexFor(term, wholeword, exactmatch) {
  if (wholeword === 'true') {
    return new RegExp('(^|\\s)' + escapeRegExp(term) + '(\\s|$)', 'i')
  } else if (exactmatch === 'true') {
    return new RegExp('(^)' + escapeRegExp(term) + '($)', 'i')
  } else {
    return new RegExp(escapeRegExp(term), 'i')
  }
}

function searchChinese(term) {
  const reg = new RegExp(escapeRegExp(term))
  return this.find().or([{ trad: reg }, { simp: reg }])
      .sort({ trad: 'asc' })
      .exec()
}

function searchPinyin(term) {
  const reg = new RegExp(escapeRegExp(term), 'i')
  return this.find({ pinyin: reg })
      .sort({ pinyin: 'asc' })
      .exec()
}

function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
