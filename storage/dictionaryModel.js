const mongoose = require('mongoose')
const each = require('async-each')
const collectionName = 'DictEntries'

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

const DictEntry = mongoose.model('DictEntry', dictSchema, collectionName)

module.exports = {
  DictEntry,
}

function getRandom(count, callback) {
  const model = this
  model.find().estimatedDocumentCount(function (err, total) {
    if (err) return callback(err)
    each(
        getRandomKeys(count, total),
        (oneKey, cb) => model.findOne({ key: oneKey }, cb),
        callback)
  })
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

function searchEnglish(term, wholeword, exactmatch, cb) {
  let reg
  if (wholeword === 'true') {
    reg = new RegExp('(^|\\s)' + escapeRegExp(term) + '(\\s|$)', 'i')
  } else if (exactmatch === 'true') {
    reg = new RegExp('(^)' + escapeRegExp(term) + '($)', 'i')
  } else {
    reg = new RegExp(escapeRegExp(term), 'i')
  }
  this.find({ english: reg })
      .sort({ english: 'asc' })
      .exec(cb)
}

function searchChinese(term, cb) {
  const reg = new RegExp(escapeRegExp(term))
  this.find().or([{ trad: reg }, { simp: reg }])
      .sort({ trad: 'asc' })
      .exec(cb)
}

function searchPinyin(term, cb) {
  const reg = new RegExp(escapeRegExp(term), 'i')
  this.find({ pinyin: reg })
      .sort({ pinyin: 'asc' })
      .exec(cb)
}

function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
