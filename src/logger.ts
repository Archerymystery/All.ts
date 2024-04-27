import { createLogger, format, transports } from "winston";
import { addColors } from "winston/lib/winston/config";

const myFormat = format.combine(
  format.timestamp({ format: "DD-MM-YY HH:mm:ss" }),
  format.printf(ops => `${ops.timestamp} [${ops.level}] ${ops.message}`),
  format.colorize({ all: true }),

);
const logger = () => {
  return createLogger({
    level: "debug",
    format: myFormat,
    transports:
      [
        new (transports.Console)({
          format: format.combine(format.colorize(), myFormat)
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
      ]
  })
}

export default logger();
