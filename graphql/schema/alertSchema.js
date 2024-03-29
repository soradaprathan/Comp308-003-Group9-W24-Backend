const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");

const alertResolver = require("../resolvers/alertResolver");

//AlertRootQueryType for Read Operations
const AlertRootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Alert Query",
  fields: alertResolver.Query,
});

//AlertRootMutationType for CRUD Operations --> create, update, and delete operations
const AlertRootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Alert Mutation",
  fields: alertResolver.Mutation,
});

module.exports = new GraphQLSchema({
  query: AlertRootQueryType,
  mutation: AlertRootMutationType,
});
