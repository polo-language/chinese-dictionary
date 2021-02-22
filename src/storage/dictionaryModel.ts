import mongoose, { Document, Model } from 'mongoose'
const { Schema }  = mongoose

const COLLECTION_NAME = 'DictEntries'

export interface DictionaryDoc extends Document {
  key: Number,
  trad: String,
  simp: String,
  pinyin: String,
  english: [String],
  showingAltEnglish: { type: Boolean, default: false }
}

const dictSchema = new Schema<DictionaryDoc>({
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

interface DictionaryModel extends Model<DictionaryDoc> {
  getRandom(this: Model<DictionaryDoc>, count: number) : Promise<DictionaryDoc[]>
  searchEnglish(
      this: Model<DictionaryDoc>,
      term: string,
      wholeword: boolean,
      exactmatch: boolean)
          : Promise<DictionaryDoc[]>
  searchChinese(this: Model<DictionaryDoc>, term: string, exactmatch: boolean)
      : Promise<DictionaryDoc[]>
  searchPinyin(this: Model<DictionaryDoc>, term: string, exactmatch: boolean)
      : Promise<DictionaryDoc[]>
}

export const DictEntry = mongoose.model<DictionaryDoc, DictionaryModel>(
    'DictEntry', dictSchema, COLLECTION_NAME)

/**
 * @param {number} count
 * @return {Promise<Array>}
 */
function getRandom(this: Model<DictionaryDoc>, count: number)
    : Promise<DictionaryDoc[]> {
  return this.find()
      .estimatedDocumentCount()
      .then(total => Promise.allSettled(
          getRandomKeys(count, total).map(oneKey =>
              this.findOne({ key: oneKey }).exec()))
      )
      .then(array => {
        const failed = array.filter(item => item !== null && item.status !== 'fulfilled')
        if (failed.length > 0) {
          console.error(`Failed to retrieve ${failed.length} random entries`)
        }
        return array.filter(item => item !== null && item.status === 'fulfilled')
            .map(item => (item as PromiseFulfilledResult<DictionaryDoc>).value)
      })
}

function getRandomKeys(count: number, total: number): number[] {
  const keys = new Set<number>()
  while (keys.size < count) {
    keys.add(randomInteger(0, total))
  }
  return Array.from<number>(keys)
}

function randomInteger(min: number, max: number): number {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)
  return Math.floor(minInt + (maxInt - minInt) * Math.random())
}

function searchEnglish(
      this: Model<DictionaryDoc>,
      term: string,
      wholeword: boolean,
      exactmatch: boolean)
          : Promise<DictionaryDoc[]> {
  return this.find({ english: <any>newRegexFor(term, wholeword, exactmatch) })
      .sort({ english: 'asc' })
      .exec()
}

function newRegexFor(term: string, wholeword: boolean, exactmatch: boolean): RegExp {
  if (wholeword) {
    return new RegExp('(^|\\s)' + escapeRegExp(term) + '(\\s|$)', 'i')
  } else if (exactmatch) {
    return new RegExp('(^)' + escapeRegExp(term) + '($)', 'i')
  } else {
    return new RegExp(escapeRegExp(term), 'i')
  }
}

function searchChinese(this: Model<DictionaryDoc>, term: string, exactmatch: boolean)
    : Promise<DictionaryDoc[]> {
  const reg = newRegexFor(term, false, exactmatch)
  return this.find().or([{ trad: <any>reg }, { simp: <any>reg }])
      .sort({ trad: 'asc' })
      .exec()
}

function searchPinyin(this: Model<DictionaryDoc>, term: string, exactmatch: boolean)
    : Promise<DictionaryDoc[]> {
  return this.find({ pinyin: <any>newRegexFor(term, false, exactmatch) })
      .sort({ pinyin: 'asc' })
      .exec()
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
