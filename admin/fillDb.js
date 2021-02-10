const MongoClient = require('mongodb').MongoClient
const mongodbUri = require('mongodb-uri')
const fs = require('fs')

const COLLECTION_NAME = 'DictEntries'

main().catch(console.error)

async function main() {
  const [connectionString, dbName, inputPath, dropCollection] = parseArgs()
  const mongoClient = new MongoClient(connectionString, {useUnifiedTopology: true})
  try {
    const [_, entries] = await Promise.all([mongoClient.connect(), parseJsonFile(inputPath)])
    const db = mongoClient.db(dbName)
    if (dropCollection) {
      console.log(`Dropping collection ${COLLECTION_NAME}`)
      await db.dropCollection(COLLECTION_NAME)
    }
    await fillCollection(db, entries)
  } finally {
    console.log('Closing client.')
    mongoClient.close()
  }
}

function parseArgs() {
  const connectionStringRaw = process.env.CONN
  if (!connectionStringRaw) {
    printUsage()
    throw new Error("Missing or empty connection string.")
  }
  const connectionString = mongodbUri.format(mongodbUri.parse(connectionStringRaw))
  
  const dbName = process.argv[2]
  const inputPath = process.argv[3]
  if (!dbName || !inputPath) {
    printUsage()
    throw new Error("Missing database name or input file path.")
  }
  const dropCollection = Boolean(process.argv[4])
  return [connectionString, dbName, inputPath, dropCollection]
}

function printUsage() {
  console.log(
    'Usage:\n'+
    'node admin/fillDb <db-name> <input.json>\n'+
    'Store the database connection string in the CONN environment variable.\n'
  )
}

async function parseJsonFile(inputPath) {
  const buffer = await fs.promises.readFile(inputPath, { encoding: 'utf8' })
  return JSON.parse(buffer)
}

async function fillCollection(db, entries) {
  const collection = db.collection(COLLECTION_NAME)
  console.log(`Writing to collection ${collection.dbName}.${COLLECTION_NAME}...`)
  for (let i = 0; i < entries.length; i += 100) {
    const end = Math.min(i + 100, entries.length)
    console.log(`Inserting entries ${i} (${entries[i].trad}) - ${end-1} (${entries[end-1].trad})`)
    await collection.insertMany(entries.slice(i, end))
  }
}
