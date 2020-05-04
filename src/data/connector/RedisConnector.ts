import AbstractSetting from 'src/core/settings/AbstractSetting';
import Logger from 'src/core/logger/Logger';
import { AbstractRedisConnection } from 'src/data/connector/AbstractRedisConnection';
import { redisTypeFromConfigMapping } from 'src/data/connector/RedisConnectionCreator';
import CollectionPerformances from 'src/entities/CollectionPerformances';
import { ECounterMetrics, EHistogramMetrics, ETimerMetrics } from 'src/entities/EAllMetrics';

export default class RedisConnector extends AbstractRedisConnection {
  /**
   * Init service from settings.
   * Calls {@link this.initializeRedisConnection}
   */
  constructor(protected _setting: AbstractSetting) {
    super();

    this._logger = new Logger(this._setting, 'RedisConnector');
    this._performanceSampler = new CollectionPerformances(
      this._setting.serverConfig.activatePerformanceSampler,
      this._setting.serverConfig.appName,
      this.constructor.name,
    );
    this.initializeRedisConnection();
    this.addCallbacks();
  }

  /* Overrides */

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

    this._redis = redisTypeFromConfigMapping(
      this._setting.redisConfig.connectionMode,
      this._setting,
      redisDriverOptions,
    );

    this._logger.info(`Redis connection: ${JSON.stringify(this._redis)}`);
  }

  public async addEntitiesOnRedis<T>(data: Map<string, T>, queryMapName: string, mapType: string) {
    const fullCollectionName = `${queryMapName}_${mapType}`;

    try {
      // copy logic from the other source
      if (!this._redis) {
        this._logger.error(`Redis connection is null, reconnecting!`);
        this.initializeRedisConnection();
        return null;
      }

      const stringValues = new Map<string, string>();
      const iterator = data.keys();
      for (let i = 0; i < data.size; i++) {
        const nextKey = iterator.next().value;
        const stringValue = JSON.stringify(data.get(nextKey));

        stringValues.set(nextKey, stringValue);
      }

      await this._redis.hmset(fullCollectionName, stringValues);
    } catch (error) {
      this._logger.error(`Writing Query to ${fullCollectionName} failed!`);
      this._logger.error(`Reason: ${error}`);
    }
  }

  public async queryForRedis<T>(queryMapName: string, mapType: string, lastRequested?: number): Promise<T[]> {
    const fullQuery = `${queryMapName}_${mapType}`;
    const startedTime = new Date();

    this._performanceSampler?.increaseCounter(ECounterMetrics.REQUESTS_TO_DB);

    try {
      // copy logic from the other source
      if (!this._redis) {
        this._logger.error(`Redis connection is null, reconnecting!`);
        this.initializeRedisConnection();
        return null;
      }

      const requestTimer = this._performanceSampler?.startTimer(ETimerMetrics.REQUESTS_TO_DB_TIMER);
      const queryResult = await this._redis.hgetall(fullQuery, (err, result) => {
        const totalTime = new Date().getMilliseconds() - startedTime.getMilliseconds();
        if (err) {
          this._logger.error(`Query to ${fullQuery} failed! Took: ${totalTime} ms.`);
          return {};
        }
        this._logger.info(
          `Query to ${fullQuery} ${lastRequested ? ' (with lastRequested) ' : ''} took: ${totalTime} ms.`,
        );
        this._performanceSampler?.increaseCounter(ECounterMetrics.REQUESTS_TO_DB_SUCCESS);
        return result;
      });

      this._performanceSampler?.increaseCounter(ECounterMetrics.REQUESTS_TO_DB_FAILED);
      this._performanceSampler?.stopTimer(requestTimer);

      const querySize = queryResult ? Object.keys(queryResult).length : 0;
      this._performanceSampler?.updateHistogram(EHistogramMetrics.COLLECTION_SIZE, querySize);

      const valuesOnly = [];
      Object.values(queryResult).forEach(value => valuesOnly.push(JSON.parse(value.toString())));

      this._logger.info(`Query to ${fullQuery} resultSize is: ${valuesOnly.length}`);
      this._logger.debug(`${fullQuery} query result: (length = ${querySize}):\n${queryResult}`);

      return valuesOnly as T[];
    } catch (error) {
      const totalTime = new Date().getMilliseconds() - startedTime.getMilliseconds();
      this._logger.error(`Query to ${fullQuery} failed! Took: ${totalTime} ms.`);
      this._logger.error(`Reason: ${error}`);
    }
    return [];
  }
}
