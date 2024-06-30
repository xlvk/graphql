const { ApolloServer, gql } = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type Query {
    user: User
  }

  type User {
    id: ID
    name: String
    email: String
  }
`;

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
