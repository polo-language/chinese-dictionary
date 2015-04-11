var express = require('express')
  , app = express()

app.set('view engine', 'jade')


app.use(express.static('/client'))

app.get('/', function (req, res) {
  //res.send('Testing, testing, 1, 2, 3...')
  res.render('index')
})

//app.listen(process.env.PORT)
var server = app.listen(3000, function () {
  console.log('listening on http://%s:%s', server.address().address
                                         , server.address().port)
})
