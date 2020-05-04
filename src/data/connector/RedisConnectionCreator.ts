import Redis from 'ioredis';

import AbstractSetting from 'src/core/settings/AbstractSetting';
import { EPreferredConnectionType, ERedisConnectionMode } from 'src/core/config_types/IRedisConfig';

export interface IRedisTypeFromConfig {
  /**
   *  This will build redis connection type based on the config.
   *  <b>Only</b> hosts and ports, you will need to assign the values for config object!
   *  This will be based om: {@link ERedisConnectionMode} & {@link EPreferredConnectionType}
   *
   * @param setting - the application settings
   * @param redisOptions - other assigned settings values
   *
   * @return Redis object or null if raised any error
   */
  fromConnectionMode(setting: AbstractSetting, redisOptions);
}

export class SingleRedisNode implements IRedisTypeFromConfig {
  /**
   * Single redis connection (no cluster or sentinels).
   * Will take the first one from hosts and ports connection.
   *      (see doc on: {@link IRedisConfig.hosts} {@link IRedisConfig.ports})
   *
   * @param setting - the application settings
   * @param redisOptions - other assigned settings values
   *
   *
   * @return Redis object or null if raised any error
   */
  fromConnectionMode(setting: AbstractSetting, redisOptions) {
    const redisOptionsWithHost = {
      host: setting.redisConfig.hosts[0],
      port: setting.redisConfig.ports[0],
      options: redisOptions,
    };

    return new Redis(redisOptionsWithHost);
  }
}

export class SentinelsRedis implements IRedisTypeFromConfig {
  /**
   * Sentinels redis connection.
   * - Don't forget about the {@link EPreferredConnectionType} value!
   * - Check's the {@link EPreferredConnectionType} mapping value (in redisConfig.role)
   *
   * @param setting - the application settings
   * @param redisOptions - other assigned settings values
   *
   *
   * @return Redis object or null if raised any error
   */
  fromConnectionMode(setting: AbstractSetting, redisOptions) {
    const sentinels = extractServerAndPorts(setting);

    // check (value -> name -> value) mapping
    redisOptions.role = EPreferredConnectionType[EPreferredConnectionType[setting.redisConfig.preferredType]];

    const redisOptionsWithHost = {
      sentinels: sentinels,
      options: redisOptions,
    };

    return new Redis(redisOptionsWithHost);
  }
}

export class ClusterRedis implements IRedisTypeFromConfig {
  /**
   * Cluster redis connection.
   * - Don't forget about the {@link EPreferredConnectionType} value!
   * - Check's the {@link EPreferredConnectionType} mapping value (in redisConfig.role)
   * - 'Role' is changed to 'scaleReads' -> checkout redis docs about the differences!
   *
   * @param setting - the application settings
   * @param redisOptions - other assigned settings values
   *
   *
   * @return Redis object or null if raised any error
   */
  fromConnectionMode(setting: AbstractSetting, redisOptions) {
    const clusterNodes = extractServerAndPorts(setting);

    // check (value -> name -> value) mapping
    redisOptions.scaleReads = EPreferredConnectionType[EPreferredConnectionType[setting.redisConfig.preferredType]];

    return new Redis.Cluster(clusterNodes, {
      redisOptions: redisOptions,
    });
  }
}

/**
 * Create static mapping between the ERedisConnectionMode and the connection initialization
 */
const redisConfigMapping = new Map<string, IRedisTypeFromConfig>();

redisConfigMapping.set(ERedisConnectionMode.CLUSTER, new ClusterRedis());
redisConfigMapping.set(ERedisConnectionMode.SENTINEL, new SentinelsRedis());
redisConfigMapping.set(ERedisConnectionMode.SINGLE_SERVER, new SingleRedisNode());

/**
 * Extract server and ports from config (for clusters)
 *
 * @param setting The app's redis config
 * @return Nodes array every object will have: {host, port}
 */
function extractServerAndPorts(setting: AbstractSetting) {
  const nodesArray = [];

  for (let i = 0; i < setting.redisConfig.ports.length; i++) {
    nodesArray.push({
      host: setting.redisConfig.hosts[i],
      port: setting.redisConfig.ports[i],
    });
  }

  return nodesArray;
}

/**
 * Export the {@link redisConfigMapping} values
 *
 * @param connectionMode key value
 * @param setting environment variables values
 * @param redisOptions object that contains other shared options (non specific for kind)
 *
 * @return Redis object or null if raised any error
 */
export function redisTypeFromConfigMapping(connectionMode: string, setting: AbstractSetting, redisOptions) {
  return redisConfigMapping.get(connectionMode)?.fromConnectionMode(setting, redisOptions);
}
