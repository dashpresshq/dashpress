import { format as dateFNSformat } from "date-fns";
import { createLogger, format, transports } from "winston";

const myFormat = format.printf(({ level, message }) => {
  return `${dateFNSformat(
    new Date(),
    "d/MM/yyyy, h:mm:ss aa"
  )} [${level}]: ${message} `;
});

export const logger = createLogger({
  level: "debug",
  format: format.combine(format.colorize(), format.splat(), myFormat),
  transports: [new transports.Console()],
});
