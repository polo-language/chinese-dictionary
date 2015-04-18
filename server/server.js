var express = require('express')
  , mongoose = require('mongoose')
  // , models = require('../models/dictionaryModel')
  , routes = require('./routes')
  , app = express()

routes.addRoutes(app)

//// start-up
mongoose.connect(process.env.CONN, function () {
  var server = app.listen(process.env.PORT, function () {
    console.log('listening on http://localhost:%s', server.address().port)
  })
})
