const schema = `
  type Human {
   lastUpdated: Float
   actionType: String
   entity: HumanEntity
  }

  type HumanEntity {
    mapType: String
    name: String
    id: Integer
  }

  # the schema allows the following query:
  type Query {
    human(bla: String, lastUpdated: Float!): [Human]
  }
`;

export default schema;
