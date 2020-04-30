import { gql } from 'apollo-server-express';

export default gql`
  type Human {
    lastUpdated: Float
    actionType: String
    entity: HumanEntity
  }

  type HumanEntity {
    mapType: String
    name: String
    id: Int
  }

  # the schema allows the following query:
  type Query {
    human(mapType: String, lastUpdated: Float!): [Human]
  }
`;
