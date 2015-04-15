var express = require('express')
  , fs = require('fs')
  , dictPath = './res/dict-json/dict_all.json'
  , dict = JSON.parse(fs.readFileSync(dictPath, { encoding: 'utf8' }))
  , app = express()

app.set('view engine', 'jade')

app.use(express.static('/client'))

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/api/entries/:count', function (req, res) {
  var count = req.params.count
    , n = 0
    , entries = {}
  if (typeof count !== 'number' || count < 1) {
    count = 1
  } else if (10000 < count) {
    count = 10000
  }
  for (var key in dict) {
    entries[key] = dict[key]
    ;++n
    if (n > count) { break; }
  }
  res.send(entries)
})

//app.listen(process.env.PORT)
var server = app.listen(process.env.PORT, function () {
  console.log('listening on http://localhost:%s', server.address().port)
})
