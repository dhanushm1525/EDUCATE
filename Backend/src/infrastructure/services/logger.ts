import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ILogger } from "../../application/interfaces/services/ILogger";

export const logger:ILogger= winston.createLogger({
    level:"info",

    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack:true}),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console(),

        new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",

            // Keep logs for 14 days
            maxFiles: "14d",

            // Compress old log files
            zippedArchive: true,

            // Optional: maximum size of a single log file
            maxSize: "20m"
        })
    ]
});