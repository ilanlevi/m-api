import { MutationDohttpArgs, ActionResponse } from 'src/interfaces/types.d';
import IAppContext from 'src/interfaces/IAppContext';

export default {
  Mutation: {
    dohttp(parent: null, args: MutationDohttpArgs, context: IAppContext): Promise<ActionResponse> {
      return context.httpManager.doHttp(args.actionRequest);
    },
  },
};
