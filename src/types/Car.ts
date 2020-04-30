const schema = `
  type Car {
   lastUpdated: Float
   actionType: String
   entity: CarEntity
  }

  type CarEntity {
    blabla: String
    _id : String
    name: String
    type: String
  }

  # the schema allows the following query:
  type Query {
    human(bla: String, lastUpdated: Float!): [Car]
  }
`

export default schema;
