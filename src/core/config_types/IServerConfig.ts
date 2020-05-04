/**
 * Express server configs
 */
export interface IServerConfig {
  port: string; // express interface port
  appName?: string; // application name
  activatePerformanceSampler: boolean; // send metrics to influx or not
}

// the config name environment variable
export const DEFAULT_SERVER_CONFIG_NAME = 'server';

/**
 * Server settings defaults
 */
export const DEFAULT_EXPRESS_SERVER_PORT = '8080';
export const DEFAULT_APP_NAME = 'blabla';
export const DEFAULT_ACTIVATE_PERFORMANCE_SAMPLER = true;

// default values
export const DEFAULT_SERVER_CONFIG: IServerConfig = {
  port: DEFAULT_EXPRESS_SERVER_PORT,
  appName: DEFAULT_APP_NAME,
  activatePerformanceSampler: DEFAULT_ACTIVATE_PERFORMANCE_SAMPLER
};
