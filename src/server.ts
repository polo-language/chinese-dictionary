import express from 'express'
import mongoose from 'mongoose'
import mongodbUri from 'mongodb-uri'
import * as queries  from './storage/queries.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const connectionString = process.env.CONN
const port = process.env.PORT

checkArgs()
addRoutes(app)
start()

function checkArgs() {
  if (!connectionString) {
    throw new Error("Missing or empty connection string.")
  }
  if (!port) {
    console.warn('Missing or empty port. Using a random free port.')
  }
}

function addRoutes(app) {
  app.set('view engine', 'pug')
  app.set('views', __dirname + '/views')

  app.use(express.static(__dirname + '/client'))
  app.use(express.static(__dirname + '/../node_modules'))

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/api/random/:count', [queries.getRandom, sendResults])
  app.get('/api/search/:lang/:term', [queries.getLangTerm, sendResults])
}

function start() {
  mongoose.connect(
      mongodbUri.formatMongoose(connectionString),
      {useNewUrlParser: true, useUnifiedTopology: true}
  ).then(() => {
    const server = app.listen(port, function () {
      console.log(`Listening on http://localhost:${server.address().port}`)
    })
  })
}

function sendResults(req, res) {
  if (req.err) {
    console.log(req.err)
    res.sendStatus(204)
    // TODO: notify of error
  } else {
    res.send(req.result)
  }
}
