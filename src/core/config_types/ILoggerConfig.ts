import * as path from 'path'
import * as Winston from "winston";

/**
 * External logger settings (for something like Kibana)
 */
export interface IExternalLoggerConfig{
    server?: string; // url
    port?: string; // port
    db?: string; // db name
    protocol? : string; // network protocol, i.e TCP/UDP
    logLevel: string;
}

/**
 * Local logger settings
 */
export interface ILoggerConfig {
    fileName: string;
    fileDir: string;
    logFileMaxSize: number;
    maxLogFiles: number;
    logLevel: string;

    // External logger settings (non mandatory)
    externalLoggerConfig?: IExternalLoggerConfig;
}

/**
 * network protocol TCP/UDP for logger
 */
export enum ENetProtocol {
    UDP = 'udp',
    HTTP = 'http',
    HTTPS = 'https',
}

/**
 * Logger level enum values
 */
export enum ELogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}


// the config name environment variable
export const DEFAULT_LOGGER_CONFIG_NAME = "logger";

/**
 * Logger format
 */
export const MY_LOGGER_FORMAT = Winston.format.printf(({ level, message, classLogged, timestamp }) => {
  return `${timestamp} [${level}]: (${classLogged}) -> ${message}`;
});


/**
 * Logger configuration defaults
 */
export const DEFAULT_LOGGER_FILE_DIR = path.join(__dirname, '../../logger/');
export const DEFAULT_LOGGER_FILE_NAME = "myapp.log";
export const DEFAULT_LOG_FILE_MAX_SIZE = 20 * 1024 * 1024; // 20 MB
export const DEFAULT_LOG_FILE_MAX_FILES = 10;
export const DEFAULT_LOG_LEVEL = ELogLevel.INFO;


// default values
export const DEFAULT_LOGGER_CONFIG:  ILoggerConfig  = {
    fileDir: DEFAULT_LOGGER_FILE_DIR,
    fileName: DEFAULT_LOGGER_FILE_NAME,
    logFileMaxSize: DEFAULT_LOG_FILE_MAX_SIZE,
    maxLogFiles: DEFAULT_LOG_FILE_MAX_FILES,
    logLevel: DEFAULT_LOG_LEVEL,
};
