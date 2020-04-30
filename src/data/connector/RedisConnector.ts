import * as Redis from 'ioredis';

import AbstractSetting from 'src/core/settings/AbstractSetting';
import Logger from 'src/core/logger/Logger';
import { AbstractRedisConnection } from 'src/data/connector/AbstractRedisConnection';
import { ERedisConnectionMode } from 'src/core/config_types/IRedisConfig';
import { redisTypeFromConfigMapping } from 'src/data/connector/RedisConnectionCreator';

export default class RedisConnector extends AbstractRedisConnection {
  /**
   * Init service from settings.
   * Calls {@link this.initializeRedisConnection}
   */
  constructor(protected _setting: AbstractSetting) {
    super();

    this.initializeLogger();
    this.initializeRedisConnection();
    this.addCallbacks();
  }

  /* Overrides */
  protected initializeLogger() {
    this._logger = new Logger(this._setting, this.constructor.name);
  }

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
      showFriendlyErrorStack: redisConf.showFriendlyErrorStack,
    };

    const connectionMode = ERedisConnectionMode[this._setting.redisConfig.connectionMode];

    this._redis = redisTypeFromConfigMapping(connectionMode, this._setting, redisDriverOptions);
  }

  public async queryForRedis<T>(queryMapName: string, mapType: string, lastRequested?: number): Promise<T[]> {
    const fullQuery = `${queryMapName}_${mapType}`;
    const startedTime = new Date();

    try {
      // copy logic from the other source
      if (!this._redis) {
        this._logger.error(`Redis connection is null, reconnecting!`);
        this.initializeRedisConnection();
        return null;
      }

      await this._redis.hgetall(fullQuery, (err, result) => {
        const totalTime = new Date().getMilliseconds() - startedTime.getMilliseconds();
        if (err) {
          this._logger.error(`Query to ${fullQuery} failed! Took: ${totalTime} ms.`);
          return null;
        }
        this._logger.info(
          `Query to ${fullQuery} ${lastRequested ? ' (with lastRequested) ' : ''} took: ${totalTime} ms.`,
        );
        return result;
      });
    } catch (error) {
      const totalTime = new Date().getMilliseconds() - startedTime.getMilliseconds();
      this._logger.error(`Query to ${fullQuery} failed! Took: ${totalTime} ms.`);
      this._logger.error(`Reason: ${error}`);
    }
    return null;
  }
}
