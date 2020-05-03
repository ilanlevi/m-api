import { QueryHumanArgs, HumanEntity} from 'src/interfaces/types.d';
import IAppContext from 'src/interfaces/IAppContext';

const QUERY_NAME = 'human';

export default {
  Query: {
    human(parent: null, args: QueryHumanArgs, context: IAppContext): Promise<HumanEntity[]> {
      return context.redisManager.queryRedis<HumanEntity>(QUERY_NAME, args.mapType, args.lastUpdated);
    },
  },
};
