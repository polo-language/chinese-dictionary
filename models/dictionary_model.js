var mongoose = require('mongoose')
  , dictSchema = new mongoose.Schema({
      trad: String,
      simp: String,
      english: String,
      english_alt: [String],
      pinyin: [String],
    })

dictSchema.statics.getEnglishFromTrad = function (zh) {}
dictSchema.statics.getEnglishFromSimp = function (zh) {}
dictSchema.statics.getAllEnglish = function (id) {}
dictSchema.statics.getPinyin = function (id) {}


