const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");
<<<<<<< HEAD
const { GraphQLDate } = require("graphql-iso-date");
const UserType = require("../types/userType");
=======

>>>>>>> 019635e (GraphQL schema resolver, closes #3)
const userResolver = require("../resolvers/userResolver");

//RootQueryType for Read Operations
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: userResolver.Query,
});

//RootMutationType for CRUD Operations --> create, update, and delete operations
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: userResolver.Mutation,
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
