import mongoose from 'mongoose'

const COLLECTION_NAME = 'pinyin_syllable'

const syllableSchema = new mongoose.Schema({ syllable: String })

syllableSchema.statics.getSyllables = function () {
  this.find()
      .sort({syllable: 'asc'})
      .exec()
}

export const PinyinSyllable =
    mongoose.model('pinyin_syllable', syllableSchema, COLLECTION_NAME)
