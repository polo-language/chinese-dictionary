var MongoClient = require('mongodb')
  , fs = require('fs')
  , entries = JSON.parse(fs.readFileSync( '../res/dict-json/dict_all.json'
                                        , { encoding: 'utf8' }))
  , entry

MongoClient.connect('mongodb://localhost/', function (err, db) {
  var myDb = db.db('chinese-dictionary')
  myDb.dropCollection('DictEntries')
  myDb.createCollection('DictEntries', function (err, nebulae) {
    for (var trad in entries) {
      entry = entries[trad]
      entry.trad = trad
      addObject(nebulae, entry)
    }
    setTimeout(function () { db.close(); }, 3000)
  })
})

function addObject(collection, obj) {
  collection.insert(obj, function (err, result) {
    if (!err) {
      console.log('Inserted: ' + result)
    }
  })
}