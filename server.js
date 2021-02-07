const express = require('express')
const mongoose = require('mongoose')
const mongodbUri = require('mongodb-uri')
const queries = require('./storage/queries')
const app = express()
const port = process.env.PORT

checkArgs()
addRoutes(app)
start()

function checkArgs() {
  if (!process.env.CONN) {
    throw new Error("Missing or empty connection string.")
  }
  if (!process.env.PORT) {
    console.warn('Missing or empty port. Using a random free port.')
  }
}

function addRoutes(app) {
  app.set('view engine', 'pug')
  app.set('views', __dirname + '/views')

  app.use(express.static(__dirname + '/client'))

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/api/random/:count', [queries.getRandom, sendResults])
  app.get('/api/search/:lang/:term', [queries.getLangTerm, sendResults])
}

function start() {
  mongoose.connect(
      mongodbUri.formatMongoose(process.env.CONN),
      {useNewUrlParser: true, useUnifiedTopology: true}
  ).then(() => {
    const server = app.listen(port, function () {
      console.log(`Listening on http://localhost:${server.address().port}`)
    })
  })
}

function sendResults(req, res) {
    if (req.err) {
    res.sendStatus(204)
    // TODO: notify of error
  }
  res.send(req.result)
}
