import { nanoid } from 'nanoid'
import { Server, Socket } from 'socket.io'
import { Logger } from './utils/Logger'

const Events = {
  CONNECTION: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
}

const rooms: Record<string, { name: string }> = {}

export const socket = (io: Server) => {
  Logger.info('Sockets enabled')

  io.on(Events.CONNECTION, (socket: Socket) => {
    Logger.info(`user connnected ${socket.id}`)

    socket.on(Events.CLIENT.CREATE_ROOM, ({ roomName }) => {
      const roomId = nanoid()

      rooms[roomId] = {
        name: roomName,
      }

      socket.join(roomId)

      socket.broadcast.emit(Events.SERVER.ROOMS, rooms)

      socket.emit(Events.SERVER.ROOMS, rooms)
      socket.emit(Events.SERVER.JOINED_ROOM, roomId)
    })

    socket.on(
      Events.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date()

        socket.to(roomId).emit(Events.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        })
      }
    )

    socket.on(Events.CLIENT.JOIN_ROOM, (roomId: string) => {
      socket.join(roomId)
      socket.emit(Events.SERVER.JOINED_ROOM, roomId)
    })
  })
}
