import config from 'config'
import express, { Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { version } from '../package.json'
import { socket } from './socket'
import { Logger } from './utils/Logger'

const port = config.get<number>('port')
const corsOrigin = config.get<string>('corsOrigin')
const host = config.get<string>('host')

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
})

app.get('/', (_, res: Response) =>
  res.send(`Server is up and running version ${version}`)
)

httpServer.listen(port, host, () => {
  Logger.info(`🚀 Server version ${version} is listening 🚀`)
  Logger.info(`http://${host}:${port}`)

  socket(io)
})
