import * as Redis from "ioredis";

import AbstractSetting from "src/core/settings/AbstractSetting";
import Logger from "src/core/logger/Logger";
import {AbstractRedisConnection} from "src/data/connector/AbstractRedisConnection";

export default class RedisConnector extends AbstractRedisConnection{

  /**
   * Init service from settings
   */
  constructor(protected _setting: AbstractSetting) {
    super(_setting);
  }



}

