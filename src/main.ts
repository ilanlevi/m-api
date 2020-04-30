import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/type-defs';
import HttpManager from 'src/services/HttpManager';
import Logger from 'src/core/logger/Logger';
import Settings from 'src/core/settings/Settings';
import HttpConnector from 'src/data/connector/HttpConnector';

const app = express();
const settings = new Settings();
const logger = new Logger(settings);
const httpConnector = new HttpConnector(logger, settings);
const httpManager = new HttpManager(logger, httpConnector);

app.use(cors());
// Should be removed when apollo-server supports offline playground
app.use(
  '/graphql-playground-react',
  express.static(require.resolve('graphql-playground-react/package.json').slice(0, -12)),
);

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: {
    httpManager,
  },
  playground: {
    cdnUrl: '.',
    version: '',
  },
});

server.applyMiddleware({ app });

app.listen({ port: settings.config.server.port }, () => {
  logger.info(`Apollo Server on http://localhost:${settings.serverConfig.port}/graphql`);
});
