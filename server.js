const express = require('express')
const mongoose = require('mongoose')
const routes = require(__dirname + '/routes')
const app = express()

routes.addRoutes(app)

//// start-up
mongoose.connect(
  process.env.CONN,
  {useNewUrlParser: true, useUnifiedTopology: true},
  function () {
    const server = app.listen(process.env.PORT, function () {
      console.log('listening on http://localhost:%s', server.address().port)
    }
  )
})
