var fs = require('fs')
  , readline = require('readline')
  , inFilePath = '../data/cedict_1_0_ts_utf-8_mdbg.txt'
  , rl = readline.createInterface(fs.createReadStream(inFilePath), console.log)
  , outFilePath = '../../test/out_02.json'
  , json = '{\n'

rl.on('line', function (line) {
  line = line.toString('utf8')
  var chinese = escapeForJson(line.substring(0, line.indexOf(' ')))
    , firstSlash = line.indexOf('/')
    , secondSlash = line.indexOf('/', firstSlash + 1)
    , english = escapeForJson(line.substring(firstSlash + 1, secondSlash))
  json += '    "' + chinese + '": {\n'
  json += '        "english": "' + english + '"\n'
  json += '    },\n'
});

rl.on('close', function () {
  json += '}\n'
  fs.open(outFilePath, 'w', function (err, fd) {
    if (err) {
      return console.log(err)
    }
    fs.write(fd, json)
  })
});

function escapeForJson(str) {
  return str.replace(/"/g, '\\"')
}
