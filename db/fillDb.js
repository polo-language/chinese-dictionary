var MongoClient = require('mongodb')
  , fs = require('fs')
  , flag = process.argv[2]
  , dbName = 'chinese-dictionary'

if (flag === '-r' || flag === '--remote') {
  connectRemote(getEntries())
} else if (flag === '-l' || flag === '--local') {
  connectLocal(getEntries())
} else {
  console.error('Usage:\n' +
                'node db/fillDb --remote <username> <password>\n' +
                'node db/fillDb --local')
}

function getEntries() {
  return JSON.parse(fs.readFileSync(__dirname + '/../res/dict-json/dict_all.json'
                                        , { encoding: 'utf8' }))
}

function connectRemote(entries) {
  MongoClient.connect( 'mongodb://' + process.argv[3] + ':' + process.argv[4] +
                       '@ds061518.mongolab.com:61518/' + dbName
                     , function (err, db) {
    if (err) return console.error(err);
    fillCollection(db, entries)
    // setTimeout(function () { db.close(); }, 30000)
  })
}
function connectLocal(entries) {
  MongoClient.connect('mongodb://localhost/', function (err, db) {
    if (err) return console.error(err);
    var myDb = db.db(dbName)
    fillCollection(myDb, entries)
    // setTimeout(function () { db.close(); }, 3000)
  })
}

function fillCollection(db, entries) {
  var n = 0
    , entry
  db.dropCollection('DictEntries')
  db.createCollection('DictEntries', function (err, collection) {
    for (var trad in entries) {
      entry = entries[trad]
      entry.key = n
      entry.trad = trad
      addObject(collection, entry)
      ++n
    }
  })
}

function addObject(collection, obj) {
  collection.insert(obj, function (err, result) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log('Inserted: ' + result)
    }
  })
}
