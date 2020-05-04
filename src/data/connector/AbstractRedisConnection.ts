import Redis from 'ioredis';

import AbstractSetting from 'src/core/settings/AbstractSetting';
import { AbstractLogger } from 'src/core/logger/AbstractLogger';
import CollectionPerformances from 'src/entities/CollectionPerformances';
import { ECounterMetrics } from 'src/entities/EAllMetrics';

export abstract class AbstractRedisConnection {
  /**
   * io-redis driver instance
   *  - For more data: {@link https://github.com/luin/ioredis/blob/master/API.md#Commander}
   */
  protected _redis: Redis.Redis;

  /**
   * class logger instance
   */
  protected _logger: AbstractLogger;

  /**
   * application settings
   */
  protected _setting: AbstractSetting;

  /**
   * performance monitor
   */
  protected _performanceSampler: CollectionPerformances;

  /* Abstracts  */

  /**
   * Initialize {@link this._redis} connection from config.
   * This will build redis host('s) based on the config.
   *
   * - For more data: {@link https://github.com/luin/ioredis/blob/master/API.md#Commander}
   */
  protected abstract initializeRedisConnection();

  /**
   * This will query the db with connection
   *
   * @param queryMapName the query map
   * @param mapType will be concat to queryMapName value
   * @param lastRequested the last time that the client requested this query (only updates will show)
   *
   * @return Promise<any> - the promise result will be the the db result
   */
  public abstract async queryForRedis(queryMapName: string, mapType: string, lastRequested?: number): Promise<any>;

  /* Some implemented connection methods */

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

    this._performanceSampler?.increaseCounter(ECounterMetrics.REDIS_RESET_CONNECTION_COUNTER);

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
        ${this._setting.redisConfig.reconnectOnError ? '' : ' not '}
        try to reconnect (check config)`);

    this._performanceSampler?.increaseCounter(ECounterMetrics.ERROR_IN_REDIS_CONNECTION_COUNTER);

    return this._setting.redisConfig.reconnectOnError;
  }

  /**
   * Add callbacks for redis connection (mainly for logs).
   */
  protected addCallbacks() {
    if (!this._redis) {
      this._logger.error(`this._redis is NULL, retry again!`);
      this._performanceSampler?.increaseCounter(ECounterMetrics.RECONNECT_ATTEMPTS_DB);
      return;
    }

    this._redis.connect(() => {
      this._logger.info('Redis is connected! (more data on debug)');
      this._logger.debug(this._redis);
      this._performanceSampler?.increaseCounter(ECounterMetrics.REDIS_CONNECTED_COUNTER);
    });

    this._redis.monitor((err, monitor) => {
      monitor.on('monitor', (time, args, source, database) => {
        this._logger.debug(`Redis monitor on connection:\n\t${time}\n\t${args}\n\t${source}\n\t${database}`);
      });
    });
  }
}
