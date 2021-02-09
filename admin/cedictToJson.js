const fs = require('fs')
const readline = require('readline')

const LINE_REGEX = /(.*?) (.*?) \[(.*?)\] \/(.*)\//

const inFilePath = process.argv[2]
const outFilePath = process.argv[3]
if (!inFilePath || !outFilePath) {
  console.log(
    'Usage:\n'+
    'node admin/cedictToJson <input.txt> <output.json>'
  )
  throw new Error("Infile and outfile must both be provided as command-line arguments")
}
let json = '{\n'
let isFirst = true
const rl = readline.createInterface(fs.createReadStream(inFilePath), console.log)

rl.on('line', function (line) {
  const lineObj = lineToObj(line.toString('utf8'))
  if (lineObj) {
    if (!isFirst) {
      json += ',\n'
    }
    isFirst = false
    json += '"'+ lineObj.trad +'":' + JSON.stringify(lineObj)
  }
});

rl.on('close', function () {
  json += '\n}\n'
  fs.writeFile(outFilePath, json, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log(`Wrote JSON to ${outFilePath}`)
    }
  })
});

function lineToObj(line) {
  if (line[0] === '#') {
    return undefined;
  } else {
    const breakdown = LINE_REGEX.exec(line)
    return {
      trad: breakdown[1],
      simp: breakdown[2],
      pinyin: breakdown[3],
      english: breakdown[4].split('/')
    }
  }
}
