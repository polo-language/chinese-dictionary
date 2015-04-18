var mongoose = require('mongoose')
  , dictSchema = new mongoose.Schema({
      trad: String,
      simp: String,
      pinyin: String,
      english: [String],
    })

dictSchema.statics.searchEnglish = searchEnglish
dictSchema.statics.searchChinese = function (zh) {}
dictSchema.statics.searchPinyin = function (id) {}

//// Function defs
function searchEnglish(en, cb) {
  var reg = new RegExp(escapeRegExp(en), 'gi')
  this.find({ english: reg })
      .sort({ english: 'asc' })
      .exec(cb)
}

//// Utility
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//// Export
var DictEntry = module.exports.DictEntry = mongoose.model('DictEntry', dictSchema)
