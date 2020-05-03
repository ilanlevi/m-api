import RedisQueryManager from 'src/services/RedisQueryManager';
import AbstractSetting from 'src/core/settings/AbstractSetting';

export default interface IAppContext {
  redisManager: RedisQueryManager;
  appSettings: AbstractSetting;
}
