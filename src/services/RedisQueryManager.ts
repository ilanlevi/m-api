import RedisConnector from 'src/data/connector/RedisConnector';
import AbstractSetting from 'src/core/settings/AbstractSetting';
import Logger from 'src/core/logger/Logger';

export default class RedisQueryManager {
  private _logger: Logger;

  constructor(private settings: AbstractSetting, private connector: RedisConnector) {
    this._logger = new Logger(this.settings, RedisQueryManager.name);
  }

  public async queryRedis<T>(queryMapName: string, mapType: string, lastRequested?: number): Promise<T[]> {
    return this.connector.queryForRedis(queryMapName, mapType, lastRequested);
  }
}
