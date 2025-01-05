import winston from "winston";
import { parseEnvVariable } from "../SharedFunctions.js";
import { enums } from "../enums/enums.js";

export const LOG_SETUP_NAME = "LOG_SETUP";
export enum LogSetup {
	PRODUCTION = "prod",
	DEVELOPMENT = "dev",
}

const colorizedDevFormat = winston.format.printf(({ level, message, timestamp }) => {
  const greyTimestamp = `\x1b[90m${timestamp}\x1b[39m`; // ANSI escape code for grey color
  return `${greyTimestamp} ${level}: ${message}`;
});

const loglevel = enums.to(LogSetup, parseEnvVariable(LOG_SETUP_NAME));


export class ExtendedLogger{

	private readonly logger: winston.Logger;

	constructor(options: winston.LoggerOptions) {
		this.logger = winston.createLogger(options);
	}

	trace(): void {
		console.trace();
	}

	error(message: unknown): void {
		this.logger.error(message);
	}

	warn(message: unknown): void {
		this.logger.warn(message);
	}

	info(message: unknown): void {
		this.logger.info(message);
	}

	debug(message: unknown): void {
		this.logger.debug(message);
	}
}

const createLogger = (options: winston.LoggerOptions): ExtendedLogger => {
	return new ExtendedLogger(options);
}

let internalLog: ExtendedLogger;

switch (loglevel) {
	case LogSetup.PRODUCTION:
		internalLog = createLogger({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss"
				}),
				winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
			),
			transports: [
				new winston.transports.Console(),
			],
		});
		break;
	case LogSetup.DEVELOPMENT:
		internalLog = createLogger({
			level: "debug",
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss"
				}),
				winston.format.colorize(),
				colorizedDevFormat
			),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({ 
					dirname: "logs", 
					filename: "error.log", 
					level: "error" 
				}),
				new winston.transports.File({ 
					dirname: "logs", 
					filename: "all.log" 
				})
			]
		});
		break;
	default:
		throw new Error("Log level not supported");
}

export const log: ExtendedLogger = internalLog;