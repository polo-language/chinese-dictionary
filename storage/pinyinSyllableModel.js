const mongoose = require('mongoose')
const syllableSchema = new mongoose.Schema({ syllable: String })
const collectionName = 'pinyin_syllable'

syllableSchema.statics.getSyllables = function (cb) {
  this.find()
      .sort({syllable: 'asc'})
      .exec(cb)
}

module.exports.PinyinSyllable = mongoose.model('pinyin_syllable', syllableSchema, collectionName)
