// Requires manual removal of final comma
const fs = require('fs')
const readline = require('readline')
const inFilePath = __dirname + '/res/CC-CEDICT/cedict_1_0_ts_utf-8_mdbg.txt'
const rl = readline.createInterface(fs.createReadStream(inFilePath), console.log)
const outFileDir = __dirname + '/res/dict-json'
const outFilePath = outFileDir + '/dict_all.json'
const json = '{\n'

fs.mkdirSync(outFileDir)

rl.on('line', function (line) {
  const bkdn = breakdownLine(line.toString('utf8'))
  if (!bkdn) { return; }
  escapeForJson(bkdn)

  json += '    "' + bkdn.trad + '": {\n'
  json += '        "simp": "' + bkdn.simp + '",\n'
  json += '        "pinyin": "' + bkdn.pinyin + '",\n'
  json += '        "english": [\n'
  for (let i = 0; i < bkdn.english.length; ++i) {
    json += '            "' + bkdn.english[i] + '"'
    if (i !== bkdn.english.length - 1) {
      json += ','
    }
    json += '\n'
  }
  json += '        ]\n'
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

function breakdownLine(line) {
  if (line[0] === '#') { return undefined; }
  const lineRegex = /(.*?) (.*?) \[(.*?)\] \/(.*)\//
  const breakdown = lineRegex.exec(line)
  return {
    trad: breakdown[1],
    simp: breakdown[2],
    pinyin: breakdown[3],
    english: breakdown[4].split('/')
  }
}

// Modifies its argument
function escapeForJson(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = escapeOne(obj[key])
    } else if (typeof obj[key] === 'object') {
      for (const i in obj[key]) {
        obj[key][i] = escapeOne(obj[key][i])
      }
    }
  }
}

function escapeOne(str) {
  return str.replace(/"/g, '\\"')
}
