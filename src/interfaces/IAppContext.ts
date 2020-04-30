import RedisQueryManager from 'src/services/RedisQueryManager';

export default interface IAppContext {
  redisManager: RedisQueryManager;
}
