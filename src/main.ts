import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/type-defs';

import Logger from 'src/core/logger/Logger';
import Settings from 'src/core/settings/Settings';
import RedisQueryManager from 'src/services/RedisQueryManager';

const app = express();
const settings = new Settings();
const logger = new Logger(settings);
const redisManager = new RedisQueryManager(settings);

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
    redisManager,
    settings,
  },
  playground: {
    cdnUrl: '.',
    version: '',
  },
});

server.applyMiddleware({ app });

app.listen({ port: settings.serverConfig.port }, () => {
  logger.info(`Apollo Server on http://localhost:${settings.serverConfig.port}/graphql`);
});
