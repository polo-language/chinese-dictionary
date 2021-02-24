import { Document } from 'mongoose'

export interface DictionaryDoc extends Document {
  key: number,
  trad: string,
  simp: string,
  pinyin: string,
  english: string[],
  showAltEnglish?: boolean,
  sortRank?: number
}
