/**
 * Redis server connection settings
 */
export interface IRedisConfig {
  hosts: string[]; // urls. Notice! #urls = #ports
  ports: string[]; // ports. Notice! #urls = #ports
  db: number; // db number
  reconnectOnError: boolean; // reconnecting on the specified errors
  connectionMode: string; // db connection mode
  preferredType: string; // node connection mode
  retryDelay: number; // how long (in ms) to wait to reconnect after connection lost
  maxRetriesPerRequest: number; // how many retries per request to do
  dbName: string; // db name
  password: string; // password
  connectionTimeout: number; // the connection time out
  showFriendlyErrorStack: boolean; // show redis driver error stack trace or not
}

/**
 * Redis connection type (for redis driver)
 */
export enum ERedisConnectionMode {
  SINGLE_SERVER = 'single',
  SENTINEL = 'sentinel',
  CLUSTER = 'cluster',
}

/**
 * Assuming that are multiple nodes, how to choose one
 */
export enum EPreferredConnectionType {
  ALL = 'all',
  WRITE_ONLY = 'master',
  READ_ONLY = 'slave',
}

/**
 * Redis connection timeout options
 */
export enum EConnectionTimeout {
  SHORT = 500,
  MEDIUM = 750,
  LONG = 1500,
  NONE = -1,
}

// the config name environment variable
export const DEFAULT_REDIS_CONFIG_NAME = 'redis';

/**
 * Redis connection defaults
 */
export const DEFAULT_REDIS_SERVER_HOST_NAME = ['localhost'];
export const DEFAULT_REDIS_SINGLE_SERVER_PORT = ['6379'];
export const DEFAULT_REDIS_SENTINEL_SERVER_PORT = ['26379'];
export const DEFAULT_REDIS_DB_NAME = 'mymaster';
export const DEFAULT_REDIS_RETRY_DELAY = 750; // 750 ms
export const DEFAULT_REDIS_RETRY_PER_QUERY = 3; // 3 times
export const DEFAULT_REDIS_RETRY_CONNECT_AFTER_ERROR = true; // 3 times
export const DEFAULT_REDIS_SHOW_FRIENDLY_ERROR_STACK = true; // showFriendlyErrorStack = true
export const DEFAULT_REDIS_DB_NUMBER = 0; // redis db number
export const DEFAULT_REDIS_NODE_CONNECTION = EPreferredConnectionType.ALL; // doesn't matter what node to choose

// default values
export const DEFAULT_REDIS_CONFIG: IRedisConfig = {
  connectionMode: ERedisConnectionMode.SINGLE_SERVER,
  hosts: DEFAULT_REDIS_SERVER_HOST_NAME,
  connectionTimeout: EConnectionTimeout.MEDIUM,
  db: DEFAULT_REDIS_DB_NUMBER,
  password: null,
  preferredType: DEFAULT_REDIS_NODE_CONNECTION,
  showFriendlyErrorStack: DEFAULT_REDIS_SHOW_FRIENDLY_ERROR_STACK,
  reconnectOnError: DEFAULT_REDIS_RETRY_CONNECT_AFTER_ERROR,
  maxRetriesPerRequest: DEFAULT_REDIS_RETRY_PER_QUERY,
  retryDelay: DEFAULT_REDIS_RETRY_DELAY,
  ports: DEFAULT_REDIS_SINGLE_SERVER_PORT,
  dbName: DEFAULT_REDIS_DB_NAME,
};
