import logger from 'pino'
import dayjs from 'dayjs'

export const Logger = logger({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
})