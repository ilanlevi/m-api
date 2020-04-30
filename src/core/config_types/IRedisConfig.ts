/**
 * Redis server connection settings
 */
export interface IRedisConfig {
    host: string; // url
    port: string; // port
    db: number; // db number
    connectionMode: string; // db connection mode
    username: string; // user name
    password : string; // password
    connectionTimeout: number; // the connection time out
}

/**
 * Redis connection type (for redis driver)
 */
export enum ERedisConnectionMode {
    MASTER = "master",
    SLAVE = "slave",
    SINGLE_SERVER = "single",
    SENTINEL = "sentinel"
}

/**
 * Redis connection timeout options
 */
export enum EConnectionTimeout {
    SHORT = 1000,
    MEDIUM = 2500,
    LONG = 10000,
    NONE = -1
}

// the config name environment variable
export const DEFAULT_REDIS_CONFIG_NAME = "redis";

/**
 * Redis connection defaults
 */
export const DEFAULT_REDIS_SINGLE_SERVER_PORT = "6379";
export const DEFAULT_REDIS_SENTINEL_SERVER_PORT = "26379";
export const DEFAULT_REDIS_USERNAME = "mymaster";

// default values
export const DEFAULT_REDIS_CONFIG: IRedisConfig = {
    connectionMode: ERedisConnectionMode.SINGLE_SERVER,
    host: "localhost",
    connectionTimeout: EConnectionTimeout.MEDIUM,
    db: 0,
    password: "",
    port: DEFAULT_REDIS_SINGLE_SERVER_PORT,
    username: DEFAULT_REDIS_USERNAME
};
