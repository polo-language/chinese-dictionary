var mongoose = require('mongoose')
  , collectionName = 'DictEntries'
  , dictSchema = new mongoose.Schema({
      trad: String,
      simp: String,
      pinyin: String,
      english: [String],
    })

dictSchema.statics.searchEnglish = searchEnglish
dictSchema.statics.searchChinese = searchChinese
dictSchema.statics.searchPinyin = searchPinyin

//// Function defs
function searchEnglish(term, cb) {
  var reg = new RegExp(escapeRegExp(term), 'i')
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
