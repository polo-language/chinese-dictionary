var mongoose = require('mongoose')
  , DictEntry = require('../models/dictionaryModel').DictEntry
  , fs = require('fs')
  , entries = JSON.parse(fs.readFileSync( '../res/dict-json/dict_all.json'
                                        , { encoding: 'utf8' }))
  , entry

mongoose.connect('mongodb://localhost/chinese-dictionary')

for (var trad in entries) {
  entry = entries[trad]
  entry.trad = trad
  saveToDb(entry)
}

mongoose.disconnect()

//// utility
function saveToDb(entry) {
  (new DictEntry(entry)).save(function (err) {
    if (err) { console.error('Error saving: ' + entry.trad)}
  })
}
