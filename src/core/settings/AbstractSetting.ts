import {IServerConfig} from "src/core/config_types/IServerConfig";
import {IAuthConfig} from "src/core/config_types/IAuthConfig";
import {ILoggerConfig} from "src/core/config_types/ILoggerConfig";
import {IRedisConfig} from "src/core/config_types/IRedisConfig";

export default abstract class AbstractSetting {

  protected _serverConfig: IServerConfig;
  protected _authConfig: IAuthConfig;
  protected _loggerConfig: ILoggerConfig;
  protected _redisConfig: IRedisConfig;

  /**
   * Init service configuration from environment variables or deafult
   */
  protected initServices() {

    this.initServerConfig();
    this.initAuthConfig();
    this.initLoggerConfig();
    this.initRedisConfig();
  }


  /**
   * Return object with settings, from process env variables or from default values (if given).
   * The method will go over all of the settings properties and try to fill it with values
   * @param configName setting name as env process
   * @param configValues the settings values defined
   * @param defaultsValues the default settings class object
   *
   * @returns config object
   */
  protected readConfigOrDefault<T>(configName:string, defaultsValues: T){
    if (!process.env[configName]) {
      console.warn(`Cannot read process.env[${configName}]! Using default!`)

      return defaultsValues;
    }

    const configValues = {};
    Object.keys(defaultsValues).forEach(keyName => {
      configValues[keyName] = process.env[configName][keyName] || defaultsValues?.[keyName];
    });

    console.info(`Settings for ${configName} is: \n${configValues}`)

    return configValues;
  }

  /* Abstracts */

  /**
   * Initialize server settings from environment variables
   */
  protected abstract initServerConfig();

  /**
   * Initialize auth settings from environment variables
   */
  protected abstract initAuthConfig();

  /**
   * Initialize logger settings from environment variables
   */
  protected abstract initLoggerConfig();

  /**
   * Initialize redis db settings from environment variables
   */
  protected abstract initRedisConfig();

  /* Getters && Setters */


  get serverConfig(): IServerConfig {
    return this._serverConfig;
  }

  set serverConfig(value: IServerConfig) {
    this._serverConfig = value;
  }

  get authConfig(): IAuthConfig {
    return this._authConfig;
  }

  set authConfig(value: IAuthConfig) {
    this._authConfig = value;
  }

  get loggerConfig(): ILoggerConfig {
    return this._loggerConfig;
  }

  set loggerConfig(value: ILoggerConfig) {
    this._loggerConfig = value;
  }

  get redisConfig(): IRedisConfig {
    return this._redisConfig;
  }

  set redisConfig(value: IRedisConfig) {
    this._redisConfig = value;
  }
}
