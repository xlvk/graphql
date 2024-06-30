//  import { createGraphiQLFetcher } from '@graphiql/toolkit';
 import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';
//  import axios from 'axios';
// import { GraphiQL } from 'graphiql';
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import 'graphiql/graphiql.css';
//  import { gql } from 'apollo-server';

//  const fetcher = createGraphiQLFetcher({ url: 'https://learn.reboot01.com/api/graphql-engine/v1/graphql' });

export const Graph = async () => {
  
  console.log("i am reaching here")
  
  // const { gql } = require('apollo-server');

  // const rootElement = document.getElementById('app');
// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(<GraphiQL fetcher={fetcher} />);
// } else {
//   console.error('Failed to find the root element');
// }

    // This is the first declaration of typeDefs
    // const typeDefs = gql`
    //   type Query {
    //     user: User
    //   }

    //   type User {
    //     id: ID
    //     name: String
    //     email: String
    //   }
    // `;

    // Remove or rename this second declaration to resolve the error
    // const typeDefs = require('./schema');

    // const { ApolloServer } = require('apollo-server');
    // const resolvers = require('./resolvers');

    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
}
