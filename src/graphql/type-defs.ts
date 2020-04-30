import { gql } from 'apollo-server-express';

export default gql`
  input ActionRequest {
    body: String
    url: String
    timeout: Int
  }

  type ActionResponse {
    status: String
    result: String
    message: String
  }

  type Mutation {
    dohttp(actionRequest: ActionRequest): ActionResponse
  }

  type Query {
    status: String
  }
`;
