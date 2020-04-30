import * as Redis from "ioredis";

import AbstractSetting from "src/core/settings/AbstractSetting";
import Logger from "src/core/logger/Logger";
import {ERedisConnectionMode} from "src/core/config_types/IRedisConfig";
import {redisTypeFromConfigMapping} from "./RedisConnectionCreator"

export abstract class AbstractRedisConnection {

  /**
   * io-redis driver instance
   *  - For more data: {@link https://github.com/luin/ioredis/blob/master/API.md#Commander}
   */
  protected _redis: Redis;


  /**
   * class logger instance
   */
  protected _logger: Logger;

  /**
   * Init service from settings.
   * Calls {@link this.initializeRedisConnection}
   */
  constructor(protected _setting: AbstractSetting) {
    this.initializeLogger();
    this.initializeRedisConnection();
    this.addCallbacks();
  }


  /**
   * Initialize {@link this._logger} from config
   */
  protected initializeLogger() {
    this._logger = new Logger(this._setting, this.constructor.name);
  }

  /**
   * Will be called when the connection is lost.
   * When the return value isn't a number, io-redis will stop trying to reconnect,
   *    and the connection will be lost forever if the user doesn't call redis.connect() manually.
   * @param timesReconnect The argument timesReconnect means this is the n-th reconnection being made
   *
   * @return represents how long (in ms) to wait to reconnect.
   *
   */
  protected redisConnectionRetryStrategy(timesReconnect: number) {
    this._logger?.error(`Redis is disconnected! Reconnect tries: ${timesReconnect}.
                Retry in: ${this._setting.redisConfig.connectionTimeout} ms.`);

    return this._setting.redisConfig.connectionTimeout;
  }

  /**
   * Besides auto-reconnect when the connection is closed,
   * io-redis supports reconnecting on the specified errors by the reconnectOnError option.
   *
   * @param errorMsg the error message that accrued on redis
   *
   * @return whether to reconnect or not on error.
   */
  protected redisReconnectOnError(errorMsg) {
    this._logger?.error(`Redis is disconnected! Error is: ${errorMsg}.\nWe will
        ${this._setting.redisConfig.reconnectOnError ? "" : " not "}
        try to reconnect (check config)`);

    return this._setting.redisConfig.reconnectOnError;
  }


  /**
   * Initialize {@link this._redis} connection from config
   * - For more data: {@link https://github.com/luin/ioredis/blob/master/API.md#Commander}
   */
  protected initializeRedisConnection() {
    const redisConf = this._setting.redisConfig;

    if (redisConf.ports.length !== redisConf.hosts.length) {
      this._logger.error(`Error in redis Config!! Exiting!`);
      this._logger.error(`redisConf.ports.length (${redisConf.ports.length})
                              !== redisConf.hosts.length (${redisConf.hosts.length})`);
      process.exit(16);
    }

    const redisDriverOptions = {
      db: redisConf.db,
      password: redisConf.password,
      connectTimeout: redisConf.connectionTimeout,
      name: redisConf.dbName,
      retryStrategy: this.redisConnectionRetryStrategy,
      redisReconnectOnError: this.redisReconnectOnError,
      retryDelayOnFailover: redisConf.connectionTimeout,
      maxRetriesPerRequest: redisConf.maxRetriesPerRequest,
      showFriendlyErrorStack: redisConf.showFriendlyErrorStack
    };

    this._redis = this.addRedisHosts(redisDriverOptions);
  }


  /**
   *  This will build redis host('s) based on the config.
   *  <b>Only</b> hosts and ports, you will need to assign the values for config object!
   */
  protected addRedisHosts(redisOptions): Redis {
    const connectionMode = ERedisConnectionMode[this._setting.redisConfig.connectionMode];

    this._redis = redisTypeFromConfigMapping(connectionMode, this._setting, redisOptions);
  }

  /**
   * Add callbacks for redis connection (mainly for logs)
   */
  protected addCallbacks() {
    if (!this._redis) {
      this._logger.error(`this._redis is NULL, retry again!`);
      return;
    }

    this._redis.connect(() => {
      this._logger.info("Redis is connected! (more data on debug)");
      this._logger.debug(this._redis);
    });

    this._redis.monitor((err, monitor) => {
      monitor.on('monitor', (time, args, source, database) => {
        this._logger.debug(`Redis monitor on connection:\n\t${time}\n\t${args}\n\t${source}\n\t${database}`);
      });
    });

  }


}

