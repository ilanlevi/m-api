export interface IConfig {
  server: IServerConfig;
  httpServer: IHttpServerConfig;
  log: ILoggerConfig;
}

interface IServerConfig {
  port: number;
}

interface IHttpServerConfig {
  host: string;
  isPortDirected: boolean;
  port?: number;
}

interface ILoggerConfig {
  level: string;
  filename: string;
  filedir: string;
}
