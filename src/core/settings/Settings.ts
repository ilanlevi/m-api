import AbstractSetting from 'src/core/settings/AbstractSetting';
import {DEFAULT_SERVER_CONFIG, DEFAULT_SERVER_CONFIG_NAME} from "src/core/config_types/IServerConfig";
import {DEFAULT_AUTH_CONFIG, DEFAULT_AUTH_CONFIG_NAME} from "src/core/config_types/IAuthConfig";
import {DEFAULT_LOGGER_CONFIG, DEFAULT_LOGGER_CONFIG_NAME} from "src/core/config_types/ILoggerConfig";
import {DEFAULT_REDIS_CONFIG, DEFAULT_REDIS_CONFIG_NAME} from "src/core/config_types/IRedisConfig";

export default class Settings extends AbstractSetting {

  constructor() {
    super();
    this.initServices();
  }

  /* Overrides */

  protected initAuthConfig() {
    this._authConfig = this.readConfigOrDefault(DEFAULT_AUTH_CONFIG_NAME, DEFAULT_AUTH_CONFIG);
  }

  protected initLoggerConfig() {
    this._loggerConfig =  this.readConfigOrDefault(DEFAULT_LOGGER_CONFIG_NAME, DEFAULT_LOGGER_CONFIG);
  }

  protected initRedisConfig() {
    this._redisConfig = this.readConfigOrDefault(DEFAULT_REDIS_CONFIG_NAME, DEFAULT_REDIS_CONFIG);
  }

  protected initServerConfig() {
    this._serverConfig = this.readConfigOrDefault(DEFAULT_SERVER_CONFIG_NAME, DEFAULT_SERVER_CONFIG);
  }
}
