import RedisConnector from 'src/data/connector/RedisConnector';
import AbstractSetting from 'src/core/settings/AbstractSetting';
import Logger from 'src/core/logger/Logger';
import HumanCreator from 'src/services/HumanCreator';

// todo: delete (just for testing)
const NUM_OF_HUMAN = 10;

export default class RedisQueryManager {
  private _logger: Logger;
  private _connector: RedisConnector;

  constructor(private _settings: AbstractSetting) {
    this._logger = new Logger(this._settings, 'RedisQueryManager');
    this._connector = new RedisConnector(this._settings);
  }

  public async queryRedis<T>(collectionName: string, envName: string, lastRequested?: number): Promise<T[]> {
    // todo: delete (just for testing)
    if (this._settings.serverConfig.createDummyDb) {
      await this.initRedis(collectionName, envName);
      this._settings.serverConfig.createDummyDb = false;
    }

    this._logger.info(
      `Received query! \tType: ${collectionName}, \tmapType: ${envName},\tlastRequested: ${lastRequested}`,
    );

    return this._connector.queryForRedis(collectionName, envName, lastRequested);
  }

  // todo: delete (just for testing)
  public async initRedis<T>(queryMapName: string, mapType: string) {
    const tmp = HumanCreator.genDb(queryMapName, mapType, NUM_OF_HUMAN);

    await this._connector.addEntitiesOnRedis(tmp, queryMapName, mapType);
  }
}
