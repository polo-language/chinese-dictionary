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

module.exports.DictEntry = mongoose.model('DictEntry', dictSchema, collectionName)

function getRandom(count, cb) {
  const that = this
  this.find().estimatedDocumentCount(function (err, total) {
    if (err) return cb(err)
    each(getRandomKeys(total), findOneByKey, cb)
  })

  function findOneByKey(oneKey, eachCallback) {
    that.findOne({ key: oneKey }, eachCallback)
  }

  function getRandomKeys(total) {
    const keys = []
    for (let i = 0; i < count; ++i) {
      keys.push(Math.floor(total * Math.random()))
    }
    return keys
  }
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
