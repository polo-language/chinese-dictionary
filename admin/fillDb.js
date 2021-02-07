const MongoClient = require('mongodb')
const mongodbUri = require('mongodb-uri')
const fs = require('fs')

if (!process.env.CONN) {
  printUsage()
  throw new Error("Missing or empty connection string.")
}

connect(mongodbUri.format(mongodbUri.parse(process.env.CONN)), getEntries())

function printUsage() {
  console.error(
    'Usage:\n'+
    'node db/fillDb <username> <password>\n'+
    'Store the database connection string in the CONN environment variable.\n'+
    'the database name must be included in the connection string.'
  )
}

function getEntries() {
  return JSON.parse(fs.readFileSync(
      __dirname + '/../res/dict-json/dict_all.json',
      { encoding: 'utf8' }
  ))
}

function connect(uri, entries) {
  MongoClient.connect(uri, function (err, db) {
    if (err) return console.error(err);
    fillCollection(db, entries)
    // setTimeout(function () { db.close(); }, 30000)
  })
}

function fillCollection(db, entries) {
  let n = 0
  db.dropCollection('DictEntries')
  db.createCollection('DictEntries', function (err, collection) {
    for (const trad in entries) {
      const entry = entries[trad]
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
      console.error('Error: ' + err)
    } else {
      console.log('Inserted: ' + result)
    }
  })
}
