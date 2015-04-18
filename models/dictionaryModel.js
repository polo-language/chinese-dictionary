var mongoose = require('mongoose')
  , collectionName = 'DictEntries'
  , dictSchema = new mongoose.Schema({
      trad: String,
      simp: String,
      pinyin: String,
      english: [String],
    })

dictSchema.statics.searchEnglish = searchEnglish
dictSchema.statics.searchChinese = function (zh) {}
dictSchema.statics.searchPinyin = function (id) {}


dictSchema.statics.getChicken = function (term, cb) {
  this.find({ english: term }, cb)
}


//// Function defs
function searchEnglish(term, cb) {
  var reg = new RegExp(escapeRegExp(term), 'i')
  this.find({ english: reg })
      .sort({ english: 'asc' })
      .exec(cb)
}

//// Utility
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//// Export
module.exports.DictEntry = mongoose.model('DictEntry', dictSchema, collectionName)
