var mongoose = require('mongoose')
  , each = require('async-each')
  , collectionName = 'DictEntries'
  , dictSchema = new mongoose.Schema(
    { key: Number 
    , trad: String
    , simp: String
    , pinyin: String
    , english: [String]
    , showingAltEnglish: { type: Boolean, default: false }
    })

dictSchema.statics.getRandom = getRandom
dictSchema.statics.searchEnglish = searchEnglish
dictSchema.statics.searchChinese = searchChinese
dictSchema.statics.searchPinyin = searchPinyin

//// Function defs
function getRandom(count, cb) {
  var that = this
  this.find().count(function (err, total) {
    if (err) return cb(err)
    each(getRandomKeys(total), findOneByKey, cb)
  })

  function findOneByKey(oneKey, eachCallback) {
    that.findOne({ key: oneKey }, eachCallback)
  }

  function getRandomKeys(total) {
    var keys = []
    for (var i = 0; i < count; ++i) {
      keys.push(Math.floor(total * Math.random()))
    }
    return keys
  }
}

function searchEnglish(term, wholeword, cb) {
  var reg

  if (wholeword === 'true') {
    reg = new RegExp('(^|\\s)' + escapeRegExp(term) + '(\\s|$)', 'i')
  } else {
    reg = new RegExp(escapeRegExp(term), 'i')
  }
  this.find({ english: reg })
      .sort({ english: 'asc' })
      .exec(cb)
}

function searchChinese(term, cb) {
  var reg = new RegExp(escapeRegExp(term))
  this.find().or([{ trad: reg }, { simp: reg }])
      .sort({ trad: 'asc' })
      .exec(cb)
}

function searchPinyin(term, cb) {
  var reg = new RegExp(escapeRegExp(term), 'i')
  this.find({ pinyin: reg })
      .sort({ pinyin: 'asc' })
      .exec(cb)
}

//// Utility
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//// Export
module.exports.DictEntry = mongoose.model('DictEntry', dictSchema, collectionName)
