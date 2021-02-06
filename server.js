var express = require('express')
  , mongoose = require('mongoose')
  , routes = require(__dirname + '/routes')
  , app = express()

routes.addRoutes(app)

//// start-up
mongoose.connect(
  process.env.CONN,
  {useNewUrlParser: true, useUnifiedTopology: true},
  function () {
    var server = app.listen(process.env.PORT, function () {
      console.log('listening on http://localhost:%s', server.address().port)
    }
  )
})
