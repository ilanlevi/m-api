import * as fs from 'fs'
import * as  Winston from 'winston'
import * as WinstonUDPTransport from 'winston-udp'

import { AbstractLogger } from './AbstractLogger';
import {ENetProtocol, MY_LOGGER_FORMAT} from "src/core/config_types/ILoggerConfig";
import AbstractSetting from "src/core/settings/AbstractSetting";

export class Logger extends AbstractLogger {
  private logger: Winston.Logger;

  constructor(private setting: AbstractSetting) {
    super();
    this.initService();
  }

  // override
  public log(level: string, message: string, classLogged?: any, ) {
    this.logger.log(level.toLowerCase(), message)
  }

  // override
  protected checkForLogFileDir() {
    const dir = this.setting.loggerConfig.fileDir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  // override
  protected initializeLogger() {
    this.logger = Winston.createLogger({
      level: this.setting.loggerConfig.logLevel,
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.timestamp(),
        MY_LOGGER_FORMAT,
      ),
      transports: [
        new Winston.transports.Console(), // write to console
        new Winston.transports.File({
          filename: this.setting.loggerConfig.fileName,
          dirname: this.setting.loggerConfig.fileDir,
          maxsize: this.setting.loggerConfig.logFileMaxSize,
          maxFiles: this.setting.loggerConfig.maxLogFiles,
          format: MY_LOGGER_FORMAT,
        })
      ]
    });

    if(this.setting.loggerConfig.externalLoggerConfig){
      this.addExternalLogger();
    }

  }

  /**
   * Add new external logger (for something like logStash).
   * (Reads from settings externalLoggerConfig)
   * todo: add more types and add mapping
   */
  protected addExternalLogger() {
    if (this.setting.loggerConfig.externalLoggerConfig.protocol == ENetProtocol.UDP) {
      const udpSettings = {
        server: this.setting.loggerConfig.externalLoggerConfig.server,
        port: this.setting.loggerConfig.externalLoggerConfig.port,
        level: this.setting.loggerConfig.externalLoggerConfig.logLevel,
        formatter: MY_LOGGER_FORMAT,
      };
      this.logger.transports.push(new WinstonUDPTransport.transports.UDP(udpSettings));
    }
  }
}
