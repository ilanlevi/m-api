export enum ECounterMetrics {
  // app connection to db
  RECONNECT_ATTEMPTS_DB = 'RECONNECT_ATTEMPTS_DB',
  ERROR_IN_REDIS_CONNECTION_COUNTER = 'ERROR_IN_REDIS_CONNECTION_COUNTER',
  REDIS_CONNECTED_COUNTER = 'REDIS_CONNECTED_COUNTER',
  REDIS_RESET_CONNECTION_COUNTER = 'REDIS_RESET_CONNECTION_COUNTER',

  // user query db counters
  REQUESTS_TO_DB = 'REQUESTS_TO_DB',
  REQUESTS_TO_DB_SUCCESS = 'REQUESTS_TO_DB_SUCCESS',
  REQUESTS_TO_DB_FAILED = 'REQUESTS_TO_DB_FAILED',
}

export enum EHistogramMetrics {
  // user query db result sizes
  COLLECTION_SIZE = 'COLLECTION_SIZE',
  NUM_OF_FILTERED_FROM_COLLECTION = 'NUM_OF_FILTERED_FROM_COLLECTION',
  NUM_OF_RETURNED = 'NUM_OF_RETURNED',
  NUM_OF_ERRORS_IN_RESOLVERS = 'NUM_OF_ERRORS_IN_RESOLVERS',
}

export enum ETimerMetrics {
  // app not connected to db time
  UN_CONNECTED_TO_DB_TIMER = 'UN_CONNECTED_TO_DB_TIMER',

  // user query db counters
  REQUESTS_TO_DB_TIMER = 'REQUESTS_TO_DB_TIMER',

  // user query db counters
  ALL_ENTITY_RESOLVER_TIMER = 'ALL_ENTITY_RESOLVER_TIMER',
  ONE_ENTITY_RESOLVER_TIMER = 'ONE_ENTITY_RESOLVER_TIMER',

  FILTER_ENTITY_TIMER = 'FILTER_ENTITY_TIMER',

  // query round trip timer
  QUERY_ROUND_TRIP_TIMER = 'COLLECTION_SIZE',
}
