import fetch, { Response } from 'node-fetch';

import AbstractSetting from 'src/core/settings/AbstractSetting';
import { ActionRequest, ActionResponse } from 'src/interfaces/types.d';
import {AbstractLogger} from "src/core/logger/AbstractLogger";
import {Logger} from "src/core/logger/Logger";

export default class HttpConnector {
  constructor(private logger: Logger, private setting: AbstractSetting) {
    this.logger.info('Setting connection to http server');
  }

  public async performHttpRequest(request: ActionRequest): Promise<ActionResponse> {
    const { isPortDirected, host, port } = this.setting.config.httpServer;
    const headers = {
      'Content-Type': 'applications/json; charset=utf-8',
      Connection: 'keep-alive',
    };
    let url: string;
    let response: Response;
    let result: ActionResponse;
    if (isPortDirected) {
      url = `http://${host}:${port}/${request.url}`;
    } else {
      url = `http://${host}/${request.url}`;
    }
    try {
      response = await fetch(url, {
        method: 'POST',
        body: request.body,
        timeout: request.timeout,
        headers,
      });

      result = await response.json();

      return {
        status: result.status,
        message: result.message,
        result: JSON.stringify(result.result),
      };
    } catch (error) {
      this.logger.debug(`User action failed, message is - ${error.message}`);
      return { status: error.status, message: error.message };
    } finally {
      this.logger.info(`got mutation action to url: ${request.url}`);
    }
  }
}
