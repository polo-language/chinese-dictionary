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
let json = '[\n'
let isFirst = true
let index = 0
const rl = readline.createInterface(fs.createReadStream(inFilePath), console.log)

rl.on('line', function (line) {
  if (ignoreLine(line)) {
    return
  } else {
    const lineObj = lineToObj(line.toString('utf8'), index)
    ++index
    if (!isFirst) {
      json += ',\n'
    }
    isFirst = false
    json += JSON.stringify(lineObj)
  }
});

rl.on('close', function () {
  json += '\n]\n'
  fs.writeFile(outFilePath, json, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log(`Finished writing JSON to ${outFilePath}`)
    }
  })
});

function ignoreLine(line) {
  return line[0] === '#'
}

function lineToObj(line, index) {
  const breakdown = LINE_REGEX.exec(line)
  return {
    key: index,
    trad: breakdown[1],
    simp: breakdown[2],
    pinyin: breakdown[3],
    english: breakdown[4].split('/')
  }
}
