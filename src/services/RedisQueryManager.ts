import RedisConnector from 'src/data/connector/RedisConnector';
import AbstractSetting from 'src/core/settings/AbstractSetting';
import Logger from 'src/core/logger/Logger';
import CollectionPerformances from 'src/entities/CollectionPerformances';
import HumanCreator from 'src/services/HumanCreator';

// todo: delete (just for testing)
const NUM_OF_HUMAN = 10;

export default class RedisQueryManager {
  private _logger: Logger;
  private _connector: RedisConnector;
  private _performanceSampler: CollectionPerformances;

  constructor(private _settings: AbstractSetting) {
    this._logger = new Logger(this._settings, 'RedisQueryManager');
    this._connector = new RedisConnector(this._settings);
    this._performanceSampler = new CollectionPerformances(
      this._settings.serverConfig.activatePerformanceSampler,
      this._settings.serverConfig.appName,
      this.constructor.name,
    );
  }

  public async queryRedis<T>(queryMapName: string, mapType: string, lastRequested?: number): Promise<T[]> {
    // todo: delete (just for testing)
    if (this._settings.serverConfig.createDummyDb) {
      await this.initRedis(queryMapName, mapType);
      this._settings.serverConfig.createDummyDb = false;
    }
    console.info(`got request!`);
    this._logger.info(
      `Received query! \tType: ${queryMapName}, \tmapType: ${mapType},\tlastRequested: ${lastRequested}`,
    );
    return this._connector.queryForRedis(queryMapName, mapType, lastRequested);
  }

  // todo: delete (just for testing)
  public async initRedis<T>(queryMapName: string, mapType: string) {
    const tmp = HumanCreator.genDb(queryMapName, mapType, NUM_OF_HUMAN);

    await this._connector.addEntitiesOnRedis(tmp, queryMapName, mapType);
  }
}
