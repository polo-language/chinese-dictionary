var mongoose = require('mongoose')
  , dictSchema = new mongoose.Schema({
      trad: String,
      simp: String,
      pinyin: String,
      english: [String],
    })

dictSchema.statics.searchEnglish = function (zh) {}
dictSchema.statics.searchChinese = function (zh) {}
dictSchema.statics.searchPinyin = function (id) {}

var DictEntry = module.exports.DictEntry = mongoose.model('DictEntry', dictSchema)
