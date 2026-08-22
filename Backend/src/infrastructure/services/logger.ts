import winston from "winston";
import { ILogger } from "../../application/interfaces/ILogger";

export const logger:ILogger= winston.createLogger({
    level:"info",

    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack:true}),
        winston.format.json()
    ),

    transports:[
        new winston.transports.Console(),
        new winston.transports.File({
            filename:"logs/app.log"
        })
    ]
});