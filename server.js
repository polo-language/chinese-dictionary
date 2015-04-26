var express = require('express')
  , mongoose = require('mongoose')
  , routes = require(__dirname + '/routes')
  , app = express()

process.env.PWD = process.cwd()

routes.addRoutes(app)

//// start-up
mongoose.connect(process.env.CONN, function () {
  var server = app.listen(process.env.PORT, function () {
    console.log('listening on http://localhost:%s', server.address().port)
  })
})
