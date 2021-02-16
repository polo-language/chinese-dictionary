import express from 'express'
import mongoose from 'mongoose'
import mongodbUri from 'mongodb-uri'
import * as queries  from './storage/queries.js'
import * as http from 'http'
import { fileURLToPath } from 'url';
import * as path from 'path';

const PATH_TO_ROOT = '..'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [connectionString, port] = checkArgs()
const app: express.Express = express()
addRoutes(app)
start(connectionString, port)

function checkArgs(): [string, number] {
  const connectionString = process.env.CONN
  if (!connectionString) {
    throw new Error('Missing or empty connection string.')
  }
  const port = process.env.PORT
  if (!port) {
    console.warn('Missing or empty port. Using a random free port.')
  }
  return [connectionString, port ? parseInt(port) : 0]
}

function addRoutes(app: express.Express) {
  app.set('view engine', 'pug')
  app.set('views', pathFromRoot('src/views'))

  app.use(express.static(pathFromRoot('src/client')))
  app.use(express.static(pathFromRoot('client')))
  app.use(express.static(pathFromRoot('node_modules')))

  app.get('/', function (_req: express.Request, res: express.Response) {
    res.render('index')
  })

  app.get('/api/random/:count', [queries.getRandom, sendResults])
  app.get('/api/search/:lang/:term', [queries.getLangTerm, sendResults])
}

function start(connectionString: string, port: number) {
  mongoose.connect(
      mongodbUri.formatMongoose(connectionString),
      {useNewUrlParser: true, useUnifiedTopology: true}
  ).then(() => {
    const server = app.listen(port, function () {
      console.log(`Listening on ${getListenAddress(server)}`)
    })
  })
}

function getListenAddress(server: http.Server): string {
  const address = server.address()
  if (!address) {
    return 'unknown address'
  } else {
    if (typeof address === 'string') {
      return address
    } else {
      return `http://localhost:${address.port}`
    }
  }
}

function sendResults(req: express.Request, res: express.Response) {
  if (req.err) {
    console.log(req.err)
    res.sendStatus(204)
    // TODO: notify of error
  } else {
    res.send(req.result)
    }
}

function pathFromRoot(...paths: string[]): string {
  return path.join(__dirname, PATH_TO_ROOT, ...paths)
}
